import Stripe from "stripe";
import type {
  ItemTaxCalculationLine,
  ShippingTaxCalculationLine,
  TaxCalculationContext,
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
} from "@medusajs/framework/types";

/**
 * Safely convert BigNumberInput (number | string | BigNumber object) to a plain number.
 * Medusa v2 uses BigNumberInput for monetary values which can be any of these formats.
 */
function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value) || 0;
  // BigNumber object — try common accessors
  const obj = value as any;
  if (typeof obj.numeric === "number") return obj.numeric;
  if (typeof obj.valueOf === "function") {
    const v = obj.valueOf();
    if (typeof v === "number") return v;
  }
  if (obj.value !== undefined) return parseFloat(String(obj.value)) || 0;
  return parseFloat(String(value)) || 0;
}

/**
 * Stripe Tax Provider for Medusa v2
 *
 * Uses Stripe Tax Calculations API to compute destination-based,
 * district-level tax rates. Covers all US states, counties, and
 * special tax districts automatically.
 *
 * Requirements:
 *  - Stripe Tax must be enabled in the Stripe Dashboard
 *  - Tax registrations must be configured for applicable states
 *  - STRIPE_API_KEY env var set on the backend
 */
class StripeTaxService {
  static identifier = "stripe-tax";

  private stripe: Stripe;

  constructor(_container: Record<string, unknown>, options: { apiKey: string }) {
    if (!options.apiKey) {
      throw new Error(
        "StripeTaxService requires a Stripe API key. Set STRIPE_API_KEY env var."
      );
    }
    this.stripe = new Stripe(options.apiKey);
  }

  getIdentifier(): string {
    return StripeTaxService.identifier;
  }

  async getTaxLines(
    itemLines: ItemTaxCalculationLine[],
    shippingLines: ShippingTaxCalculationLine[],
    context: TaxCalculationContext
  ): Promise<(ItemTaxLineDTO | ShippingTaxLineDTO)[]> {
    // No items to tax — return empty
    if (!itemLines || itemLines.length === 0) {
      return [];
    }

    const address = context.address;

    // If no address or no country, we can't calculate tax yet — return 0% rather
    // than crashing, because Medusa may recalculate tax during payment session
    // creation before the address is fully populated in the context.
    if (!address?.country_code) {
      console.warn("[stripe-tax] No shipping address in context — returning 0% tax");
      return [];
    }

    // Build Stripe Tax line items from Medusa cart items
    const stripeLineItems: Stripe.Tax.CalculationCreateParams.LineItem[] = [];

    for (const itemLine of itemLines) {
      const item = itemLine.line_item;
      const unitPrice = toNumber(item.unit_price);
      const quantity = toNumber(item.quantity) || 1;

      // Medusa v2 internal unit_price is in smallest currency unit (cents).
      // Stripe Tax also expects amounts in smallest currency unit.
      // So: total = unitPrice * quantity (no ×100 conversion needed).
      const amount = Math.round(unitPrice * quantity);

      stripeLineItems.push({
        amount,
        reference: item.id,
        tax_behavior: "exclusive",
        tax_code: "txcd_99999999",
      });
    }

    // Calculate total shipping cost for Stripe
    let shippingAmount = 0;
    for (const shippingLine of shippingLines) {
      // shipping_line.unit_price is also in smallest currency unit
      shippingAmount += Math.round(toNumber(shippingLine.shipping_line.unit_price));
    }

    const state = (address.province_code || (address as any).province || "").toUpperCase();

    // Build Stripe Tax calculation request
    const calcParams: Stripe.Tax.CalculationCreateParams = {
      currency: itemLines[0]?.line_item.currency_code || "usd",
      line_items: stripeLineItems,
      customer_details: {
        address: {
          line1: address.address_1 || undefined,
          city: address.city || undefined,
          state: state || undefined,
          postal_code: address.postal_code || undefined,
          country: address.country_code.toUpperCase(),
        },
        address_source: "shipping",
      },
    };

    // Add shipping cost if any
    if (shippingAmount > 0) {
      calcParams.shipping_cost = {
        amount: shippingAmount,
        tax_behavior: "exclusive",
      };
    }

    // Call Stripe Tax API with logging for diagnostics
    let calculation: Stripe.Tax.Calculation;
    try {
      console.log("[stripe-tax] Calling Stripe Tax API:", JSON.stringify({
        currency: calcParams.currency,
        line_items_count: stripeLineItems.length,
        line_items_amounts: stripeLineItems.map(li => li.amount),
        address: calcParams.customer_details!.address,
        shipping_amount: shippingAmount,
      }));

      calculation = await this.stripe.tax.calculations.create(calcParams);

      console.log("[stripe-tax] Success:", {
        tax_amount: calculation.tax_amount_exclusive,
        line_items_count: calculation.line_items?.data?.length,
      });
    } catch (err: any) {
      console.error("[stripe-tax] Stripe Tax API FAILED:", err.message);
      console.error("[stripe-tax] Full params:", JSON.stringify(calcParams));
      // Return 0% tax instead of crashing checkout.
      // The error is logged above for debugging.
      return [];
    }

    // Build Medusa tax lines from Stripe response
    const taxLines: (ItemTaxLineDTO | ShippingTaxLineDTO)[] = [];

    // Map Stripe line items back to Medusa items by reference
    const stripeItems = calculation.line_items?.data || [];

    for (const stripeItem of stripeItems) {
      const medusaItemId = stripeItem.reference;
      if (!medusaItemId) continue;

      // Calculate effective tax rate percentage from Stripe's amounts
      const itemAmount = stripeItem.amount;
      const itemTax = stripeItem.amount_tax;

      let effectiveRate = 0;
      if (itemAmount > 0 && itemTax > 0) {
        effectiveRate = (itemTax / itemAmount) * 100;
        effectiveRate = Math.round(effectiveRate * 10000) / 10000;
      }

      // Get tax breakdown details for name/code
      const breakdown = stripeItem.tax_breakdown?.[0];
      const taxName =
        breakdown?.tax_rate_details?.display_name || "Sales Tax";
      const taxCode = breakdown?.tax_rate_details?.tax_type || "sales_tax";

      taxLines.push({
        rate: effectiveRate,
        name: taxName,
        code: taxCode,
        line_item_id: medusaItemId,
        provider_id: this.getIdentifier(),
      });
    }

    // Handle shipping tax
    if (shippingLines.length > 0 && calculation.shipping_cost) {
      const shippingTax = calculation.shipping_cost.amount_tax || 0;
      let shippingRate = 0;
      if (shippingAmount > 0 && shippingTax > 0) {
        shippingRate = (shippingTax / shippingAmount) * 100;
        shippingRate = Math.round(shippingRate * 10000) / 10000;
      }

      for (const shippingLine of shippingLines) {
        taxLines.push({
          rate: shippingRate,
          name: "Shipping Tax",
          code: "shipping_tax",
          shipping_line_id: shippingLine.shipping_line.id,
          provider_id: this.getIdentifier(),
        });
      }
    }

    return taxLines;
  }
}

export default StripeTaxService;
