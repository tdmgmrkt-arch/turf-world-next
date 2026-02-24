import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * POST /store/carts/:id/set-shipping-price
 *
 * Updates the shipping option price in the pricing module so that when the
 * storefront subsequently calls addShippingMethod, Medusa creates the cart
 * shipping method at the correct amount.
 *
 * IMPORTANT: Must be called BEFORE addShippingMethod, not after. When Medusa
 * creates a payment collection it recalculates cart totals from the shipping
 * option's stored price — so the option price must be correct at method-creation
 * time. Post-hoc updates to the shipping method amount are overridden.
 *
 * Body: { amount_cents: number }  — shipping cost in cents (e.g. 15000 = $150)
 *
 * Updates all shipping options in "shipping" type fulfillment sets (excludes
 * will-call/pickup options). Since this is a single-vendor store with low
 * concurrent checkout volume, shared option price updates are safe.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { amount_cents } = req.body as { amount_cents: number };

  if (typeof amount_cents !== "number" || amount_cents < 0) {
    res.status(400).json({ error: "amount_cents must be a non-negative number" });
    return;
  }

  try {
    const fulfillmentModule = req.scope.resolve("fulfillment") as any;
    const pricingModule = req.scope.resolve("pricing") as any;
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any;

    const amountMajor = amount_cents / 100;

    // 1. Find all fulfillment sets of type "shipping" (excludes "pickup" / will-call)
    const fulfillmentSets = await fulfillmentModule.listFulfillmentSets(
      { type: "shipping" },
      { relations: ["service_zones"] }
    );

    const serviceZoneIds = fulfillmentSets.flatMap(
      (fs: any) => (fs.service_zones || []).map((sz: any) => sz.id)
    );

    if (serviceZoneIds.length === 0) {
      console.log("[set-shipping-price] No shipping service zones found");
      res.json({ success: true });
      return;
    }

    // 2. Get all shipping options for those service zones
    const shippingOptions = await fulfillmentModule.listShippingOptions({
      service_zone_id: serviceZoneIds,
    });

    if (shippingOptions.length === 0) {
      console.log("[set-shipping-price] No shipping options found in service zones");
      res.json({ success: true });
      return;
    }

    const optionIds = shippingOptions.map((o: any) => o.id);

    // 3. Query the prices for these options (via the pricing module link)
    const { data: optionsWithPrices } = await query.graph({
      entity: "shipping_option",
      fields: ["id", "prices.*"],
      filters: { id: optionIds },
    });

    // 4. Update each USD price to the new amount
    let updatedCount = 0;
    for (const opt of optionsWithPrices) {
      for (const price of opt.prices || []) {
        if (price.currency_code === "usd") {
          await pricingModule.updatePrices([{ id: price.id, amount: amountMajor }]);
          console.log(`[set-shipping-price] Updated option "${opt.id}" price to ${amountMajor} (${amount_cents} cents)`);
          updatedCount++;
        }
      }
    }

    console.log(`[set-shipping-price] Done — updated ${updatedCount} price(s) to $${amountMajor}`);
    res.json({ success: true, updated: updatedCount });
  } catch (err: any) {
    console.error("[set-shipping-price] Error:", err);
    res.status(500).json({ error: err.message || "Failed to update shipping price" });
  }
}
