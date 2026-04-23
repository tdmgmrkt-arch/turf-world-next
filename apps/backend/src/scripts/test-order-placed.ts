import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { buildGhlPayload } from "../subscribers/order-placed-to-ghl";

/**
 * Build the exact GHL payload the order-placed subscriber would send for a real order,
 * but override the customer email so we don't email the actual customer during testing.
 *
 * Usage:
 *   set DATABASE_URL=...
 *   set STRIPE_API_KEY=...
 *   npx medusa exec ./src/scripts/test-order-placed.ts
 */
const ORDER_ID = "order_01KPEVX33WDK6S9KWNHD5GA870";
const TEST_EMAIL_OVERRIDE = "kenneth.lerch@gmail.com";
const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/lBYgCVRxgw7QkJkVotLZ/webhook-trigger/c5fe0399-c4b7-41e5-979b-e9822fd4e86f";
const DRY_RUN = true;

// Force the fulfillment classification for testing the will-call branch against
// an order that was actually a shipping order. Options: "" | "will-call" | "nextday" | "freight".
// Empty string = use whatever the order's real metadata says.
const FORCE_FULFILLMENT_TYPE: "" | "will-call" | "nextday" | "freight" = "";

export default async function testOrderPlaced({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "created_at",
      "metadata",
      "summary.*",
      "items.title",
      "items.variant_title",
      "items.quantity",
      "items.detail.quantity",
      "items.unit_price",
      "items.metadata",
      "shipping_address.first_name",
      "shipping_address.last_name",
      "shipping_address.address_1",
      "shipping_address.address_2",
      "shipping_address.city",
      "shipping_address.province",
      "shipping_address.postal_code",
      "shipping_address.phone",
      "shipping_methods.name",
      "shipping_methods.amount",
    ],
    filters: { id: ORDER_ID },
  });

  const order = orders[0];
  if (!order) {
    logger.error(`Order ${ORDER_ID} not found`);
    return;
  }

  logger.info(`--- order.summary ---`);
  logger.info(JSON.stringify(order.summary, null, 2));

  // Optionally override fulfillment metadata so we can preview the will-call branch
  // against an order that was actually a shipping order.
  if (FORCE_FULFILLMENT_TYPE) {
    const mockedMetadata: Record<string, string> = {
      ...(order.metadata ?? {}),
      shipping_type: FORCE_FULFILLMENT_TYPE,
    };
    if (FORCE_FULFILLMENT_TYPE === "will-call") {
      mockedMetadata.pickup_location_name = "Pomona Warehouse";
      mockedMetadata.pickup_location_address = "1970 W Holt Ave, Pomona, CA 91768";
    }
    order.metadata = mockedMetadata;
    logger.warn(`[FORCE_FULFILLMENT_TYPE=${FORCE_FULFILLMENT_TYPE}] overrode order.metadata for testing`);
  }

  const payload = buildGhlPayload(order, TEST_EMAIL_OVERRIDE);

  logger.info(`Built payload for order ${order.id} (display=${order.display_id}, real_email=${order.email}, overridden_to=${TEST_EMAIL_OVERRIDE})`);
  logger.info(`--- PAYLOAD ---`);
  logger.info(JSON.stringify(payload, null, 2));
  logger.info(`--- END ---`);

  if (DRY_RUN) {
    logger.info(`[DRY_RUN] Skipping POST. Flip DRY_RUN=false to send.`);
    return;
  }

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    logger.error(`Webhook returned ${res.status}: ${body}`);
    return;
  }
  logger.info(`Webhook accepted. Check GHL → emails to ${TEST_EMAIL_OVERRIDE} and David.`);
}
