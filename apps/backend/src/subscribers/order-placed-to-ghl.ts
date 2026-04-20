import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * On order.placed, POST the order payload to a GHL inbound webhook.
 * GHL handles: customer confirmation email, admin alert (SMS/email), CRM contact creation.
 *
 * Required env:
 *   GHL_ORDER_WEBHOOK_URL — the GHL inbound webhook URL
 *
 * Totals are computed defensively:
 *   - grand total from order.summary.current_order_total (authoritative — what was paid)
 *   - item subtotal from sum(quantity * unit_price) per line item
 *   - shipping from sum(shipping_methods[].amount)
 *   - tax = total - item_subtotal - shipping
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
      "created_at",
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
    filters: { id: data.id },
  });

  const order = orders[0];
  if (!order) {
    logger.error(`[order-placed-ghl] order ${data.id} not found`);
    return;
  }

  const payload = buildGhlPayload(order);

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

/**
 * Build the GHL webhook payload from a Medusa order.
 * Exported so scripts can reuse the same shaping logic.
 */
export function buildGhlPayload(order: any, emailOverride?: string) {
  const a = order.shipping_address ?? {};
  const firstName = a.first_name ?? "";
  const lastName = a.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  const items = order.items ?? [];
  const shippingMethods = order.shipping_methods ?? [];

  const itemSubtotal = items.reduce((sum: number, i: any) => {
    return sum + qtyOf(i) * num(i.unit_price);
  }, 0);

  const shippingTotal = shippingMethods.reduce((sum: number, m: any) => sum + num(m.amount), 0);

  const grandTotal = num(order.summary?.current_order_total ?? order.summary?.paid_total ?? 0);
  const taxTotal = Math.max(0, round2(grandTotal - itemSubtotal - shippingTotal));

  const itemsLines = items
    .map((i: any) => {
      const qty = qtyOf(i);
      const lineTotal = qty * num(i.unit_price);
      const cutLabel = i.metadata?.cut_label ? ` — ${i.metadata.cut_label} cut` : "";
      return `${qty} sq ft — ${i.title}${cutLabel} @ ${money(i.unit_price)} = ${money(lineTotal)}`;
    })
    .join("\n");

  const shippingMethodSummary = shippingMethods
    .map((m: any) => `${m.name} (${money(m.amount)})`)
    .join(", ");

  const addressOneLine = [
    [a.address_1, a.address_2].filter(Boolean).join(", "),
    [a.city, a.province, a.postal_code].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  const displayId = order.display_id ?? 0;
  const displayIdFormatted = `TW-${10000 + Number(displayId)}`;

  return {
    event: "order.placed",
    order_id: order.id,
    display_id: displayId,
    display_id_formatted: displayIdFormatted,
    placed_at: order.created_at,

    customer_email: emailOverride ?? order.email,
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
    subtotal: round2(itemSubtotal),
    shipping_total: round2(shippingTotal),
    tax_total: taxTotal,
    total: round2(grandTotal),

    subtotal_formatted: money(itemSubtotal),
    shipping_total_formatted: money(shippingTotal),
    tax_total_formatted: money(taxTotal),
    total_formatted: money(grandTotal),

    shipping_method: shippingMethodSummary,
    items_count: items.length,
    items_text: itemsLines,
    items: items.map((i: any) => {
      const qty = qtyOf(i);
      const lineTotal = qty * num(i.unit_price);
      return {
        title: i.title,
        variant_title: i.variant_title ?? "",
        cut_label: i.metadata?.cut_label ?? "",
        quantity: qty,
        unit_price: num(i.unit_price),
        total: round2(lineTotal),
        unit_price_formatted: money(i.unit_price),
        total_formatted: money(lineTotal),
      };
    }),
  };
}

function num(v: unknown): number {
  return Number(v ?? 0);
}

function qtyOf(item: any): number {
  const q = num(item.quantity);
  if (q > 0) return q;
  return num(item.detail?.quantity);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function money(v: unknown): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num(v));
}
