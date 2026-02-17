import Stripe from "stripe";
import type {
  ItemTaxCalculationLine,
  ShippingTaxCalculationLine,
  TaxCalculationContext,
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
} from "@medusajs/framework/types";

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
    const address = context.address;

    // If no address or no country, we can't calculate tax
    if (!address?.country_code) {
      throw new Error("Cannot calculate tax: no shipping address provided");
    }

    // Build Stripe Tax line items from Medusa cart items
    const stripeLineItems: Stripe.Tax.CalculationCreateParams.LineItem[] = [];

    for (const itemLine of itemLines) {
      const item = itemLine.line_item;
      const unitPrice = Number(item.unit_price || 0);
      const quantity = Number(item.quantity || 1);

      // Stripe expects amounts in smallest currency unit (cents for USD).
      // Medusa v2 stores amounts in major units (dollars), so multiply by 100.
      const amountInCents = Math.round(unitPrice * quantity * 100);

      stripeLineItems.push({
        amount: amountInCents,
        reference: item.id,
        tax_behavior: "exclusive",
        // General tangible goods tax code
        tax_code: "txcd_99999999",
      });
    }

    // Calculate total shipping cost for Stripe
    let shippingAmountCents = 0;
    for (const shippingLine of shippingLines) {
      shippingAmountCents += Math.round(
        Number(shippingLine.shipping_line.unit_price || 0) * 100
      );
    }

    // Build Stripe Tax calculation request
    const calcParams: Stripe.Tax.CalculationCreateParams = {
      currency: itemLines[0]?.line_item.currency_code || "usd",
      line_items: stripeLineItems,
      customer_details: {
        address: {
          line1: address.address_1 || "",
          city: address.city || "",
          state: (address.province_code || (address as any).province || "").toUpperCase(),
          postal_code: address.postal_code || "",
          country: address.country_code.toUpperCase(),
        },
        address_source: "shipping",
      },
    };

    // Add shipping cost if any
    if (shippingAmountCents > 0) {
      calcParams.shipping_cost = {
        amount: shippingAmountCents,
        tax_behavior: "exclusive",
      };
    }

    // Call Stripe Tax API — do NOT silently fail; surface errors to block checkout
    const calculation = await this.stripe.tax.calculations.create(calcParams);

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
        // Round to 4 decimal places for precision
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
      if (shippingAmountCents > 0 && shippingTax > 0) {
        shippingRate = (shippingTax / shippingAmountCents) * 100;
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
