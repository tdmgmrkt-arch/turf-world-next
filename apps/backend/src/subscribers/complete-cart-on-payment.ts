import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { completeCartWorkflow } from "@medusajs/medusa/core-flows";

/**
 * Server-side safety net: when Stripe (or any provider) reports payment captured,
 * auto-complete the cart into an order. This guards against the storefront's
 * client-side completeCheckout() call failing after payment already succeeded.
 */
export default async function completeCartOnPayment({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const paymentId = data.id;

  const { data: payments } = await query.graph({
    entity: "payment",
    fields: [
      "id",
      "payment_collection.id",
      "payment_collection.cart.id",
      "payment_collection.cart.completed_at",
    ],
    filters: { id: paymentId },
  });

  const cart = payments[0]?.payment_collection?.cart;

  if (!cart?.id) {
    logger.warn(`[complete-cart-on-payment] payment ${paymentId} has no linked cart; skipping`);
    return;
  }

  if (cart.completed_at) {
    logger.info(`[complete-cart-on-payment] cart ${cart.id} already completed; skipping`);
    return;
  }

  logger.info(`[complete-cart-on-payment] payment ${paymentId} captured → completing cart ${cart.id}`);

  try {
    const { result } = await completeCartWorkflow(container).run({
      input: { id: cart.id },
    });
    logger.info(`[complete-cart-on-payment] cart ${cart.id} completed → order ${result.id}`);
  } catch (err: any) {
    const msg = String(err?.message ?? err);
    if (msg.toLowerCase().includes("already completed")) {
      logger.info(`[complete-cart-on-payment] cart ${cart.id} was completed concurrently; no-op`);
      return;
    }
    logger.error(`[complete-cart-on-payment] failed to complete cart ${cart.id}: ${msg}`);
    throw err;
  }
}

export const config: SubscriberConfig = {
  event: "payment.captured",
};
