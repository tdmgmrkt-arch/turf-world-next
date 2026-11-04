/**
 * Google Tag Manager dataLayer helpers.
 *
 * GTM container GTM-PLB3WW9P is loaded in app/layout.tsx. These helpers only
 * push events; the GA4 tags that consume them are configured in GTM itself.
 */

interface DataLayerWindow extends Window {
  dataLayer?: Record<string, unknown>[];
}

function pushToDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}

export interface PurchaseItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

export interface PurchaseEvent {
  transactionId: string;
  /** Order total in cents. */
  totalCents: number;
  /** Shipping in cents. */
  shippingCents?: number;
  /** Tax in cents. */
  taxCents?: number;
  currency?: string;
  items?: PurchaseItem[];
}

/**
 * Push a GA4 `purchase` event. Guarded so a repeat call for the same order
 * (re-render, back button, refresh) cannot double-count revenue.
 */
export function pushPurchase({
  transactionId,
  totalCents,
  shippingCents = 0,
  taxCents = 0,
  currency = "USD",
  items = [],
}: PurchaseEvent) {
  if (typeof window === "undefined" || !transactionId) return;

  const guardKey = `ga4_purchase_${transactionId}`;
  try {
    if (sessionStorage.getItem(guardKey)) return;
    sessionStorage.setItem(guardKey, "1");
  } catch {
    // sessionStorage unavailable (private mode) — fire anyway rather than lose the conversion.
  }

  // Clear any previous ecommerce payload so GTM does not merge stale item data.
  pushToDataLayer({ ecommerce: null });

  pushToDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: transactionId,
      value: Number((totalCents / 100).toFixed(2)),
      shipping: Number((shippingCents / 100).toFixed(2)),
      tax: Number((taxCents / 100).toFixed(2)),
      currency,
      items,
    },
  });
}
