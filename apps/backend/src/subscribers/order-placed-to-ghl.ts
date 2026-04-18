import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * On order.placed, POST the order payload to a GHL inbound webhook.
 * GHL handles: customer confirmation email, admin alert (SMS/email), CRM contact creation.
 *
 * Required env:
 *   GHL_ORDER_WEBHOOK_URL — the GHL inbound webhook URL
 *
 * If unset, this subscriber no-ops (safe for local dev).
 */
export default async function orderPlacedToGhl({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const webhookUrl = process.env.GHL_ORDER_WEBHOOK_URL;
  if (!webhookUrl) {
    logger.warn(`[order-placed-ghl] GHL_ORDER_WEBHOOK_URL not set; skipping order ${data.id}`);
    return;
  }

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "total",
      "subtotal",
      "shipping_total",
      "tax_total",
      "created_at",
      "items.title",
      "items.variant_title",
      "items.quantity",
      "items.unit_price",
      "items.total",
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
    filters: { id: data.id },
  });

  const order = orders[0];
  if (!order) {
    logger.error(`[order-placed-ghl] order ${data.id} not found`);
    return;
  }

  const a = order.shipping_address ?? {};
  const firstName = a.first_name ?? "";
  const lastName = a.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  const itemsLines = (order.items ?? [])
    .map((i: any) => {
      const variant = i.variant_title ? ` (${i.variant_title})` : "";
      return `${i.quantity} sq ft — ${i.title}${variant} @ ${money(i.unit_price)} = ${money(i.total)}`;
    })
    .join("\n");

  const shippingMethod = (order.shipping_methods ?? [])
    .map((m: any) => `${m.name} (${money(m.amount)})`)
    .join(", ");

  const addressOneLine = [
    [a.address_1, a.address_2].filter(Boolean).join(", "),
    [a.city, a.province, a.postal_code].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  const payload = {
    event: "order.placed",
    order_id: order.id,
    display_id: order.display_id ?? order.id,
    placed_at: order.created_at,

    customer_email: order.email,
    customer_first_name: firstName,
    customer_last_name: lastName,
    customer_full_name: fullName,
    customer_phone: a.phone ?? "",

    shipping_address_1: a.address_1 ?? "",
    shipping_address_2: a.address_2 ?? "",
    shipping_city: a.city ?? "",
    shipping_state: a.province ?? "",
    shipping_postal_code: a.postal_code ?? "",
    shipping_address_oneline: addressOneLine,

    currency: (order.currency_code ?? "usd").toUpperCase(),
    subtotal: num(order.subtotal),
    shipping_total: num(order.shipping_total),
    tax_total: num(order.tax_total),
    total: num(order.total),

    subtotal_formatted: money(order.subtotal),
    shipping_total_formatted: money(order.shipping_total),
    tax_total_formatted: money(order.tax_total),
    total_formatted: money(order.total),

    shipping_method: shippingMethod,
    items_count: (order.items ?? []).length,
    items_text: itemsLines,
    items: (order.items ?? []).map((i: any) => ({
      title: i.title,
      variant_title: i.variant_title ?? "",
      quantity: i.quantity,
      unit_price: num(i.unit_price),
      total: num(i.total),
      unit_price_formatted: money(i.unit_price),
      total_formatted: money(i.total),
    })),
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.error(`[order-placed-ghl] webhook returned ${res.status} for order ${order.id}: ${body}`);
      return;
    }
    logger.info(`[order-placed-ghl] posted order ${order.id} to GHL (display_id=${payload.display_id})`);
  } catch (err: any) {
    logger.error(`[order-placed-ghl] POST failed for order ${order.id}: ${err?.message ?? err}`);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};

function num(v: unknown): number {
  return Number(v ?? 0);
}

function money(v: unknown): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num(v));
}
