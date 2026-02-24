import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

/**
 * POST /store/carts/:id/set-shipping-price
 *
 * Updates the shipping method amount on a cart so that Medusa/Stripe
 * charge the correct shipping cost calculated on the storefront.
 *
 * Body: { amount_cents: number }  — shipping cost in cents (e.g. 15000 = $150)
 *
 * The storefront calculates shipping locally (next-day $150, LTL 10% of subtotal,
 * will-call $0). This endpoint syncs that calculated price into Medusa so the
 * payment collection and Stripe charge include the correct amount.
 *
 * Medusa stores amounts in major currency units (dollars), so we divide by 100.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const cartId = req.params.id;
  const { amount_cents } = req.body as { amount_cents: number };

  if (typeof amount_cents !== "number" || amount_cents < 0) {
    res.status(400).json({ error: "amount_cents must be a non-negative number" });
    return;
  }

  try {
    const cartService = req.scope.resolve(Modules.CART) as any;

    // Retrieve the cart with its shipping methods
    const [cart] = await cartService.listCarts(
      { id: [cartId] },
      { relations: ["shipping_methods"] }
    );

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    const shippingMethods = cart.shipping_methods || [];

    if (shippingMethods.length === 0) {
      res.status(400).json({ error: "No shipping methods found on cart" });
      return;
    }

    // Medusa stores amounts in major currency units (dollars)
    const amountMajor = amount_cents / 100;

    // Put the full shipping cost on the first method, $0 on the rest.
    // Carts may have one method per shipping profile — all profiles need a method
    // for cart completion to succeed, but only one should carry the shipping cost.
    const updates = shippingMethods.map((sm: any, i: number) => ({
      id: sm.id,
      amount: i === 0 ? amountMajor : 0,
    }));

    await cartService.updateShippingMethods(updates);

    res.json({ success: true });
  } catch (err: any) {
    console.error("[set-shipping-price] Error:", err);
    res.status(500).json({ error: err.message || "Failed to update shipping price" });
  }
}
