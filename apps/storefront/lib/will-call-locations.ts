import { PRODUCTS } from "./products";
import type { CartItem } from "@/types";

// ================================================
// WILL CALL LOCATION DATA
// ================================================

export interface WillCallLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  productIds: string[];
}

export const WILL_CALL_LOCATIONS: WillCallLocation[] = [
  {
    id: "willcall-irvine",
    name: "Irvine",
    address: "15791 Rockfield Blvd, Ste D",
    city: "Irvine",
    state: "CA",
    zip: "92618",
    productIds: [
      "olive-73-pet",
      "olive-92-pet",
      "bermuda-87-pet",
      "bermuda-93-pet",
      "natural-93-pet",
    ],
  },
  {
    id: "willcall-pomona",
    name: "Pomona",
    address: "1970 W Holt Ave",
    city: "Pomona",
    state: "CA",
    zip: "91768",
    productIds: [
      "turf-world-63",
      "idaho-76",
      "hawaii-80",
      "colorado-80",
      "texas-80",
      "turf-world-88",
      "idaho-93",
      "nevada-95",
      "hawaii-96",
      "colorado-95",
      "super-natural-96",
      "nevada-103",
      "nevada-110",
      "super-natural-120",
      "texas-130",
      "colorado-130",
    ],
  },
  {
    id: "willcall-chino",
    name: "Chino",
    address: "14651 Yorba Ave",
    city: "Chino",
    state: "CA",
    zip: "91710",
    productIds: [
      "veridian-91",
    ],
  },
];

// ================================================
// ELIGIBILITY LOGIC
// ================================================

/** Categories considered "turf" for will-call eligibility. */
const TURF_CATEGORIES = new Set(["landscape", "pet", "putting"]);

/**
 * Check if a cart item is a turf product (not an accessory).
 * Accessories don't appear in the PRODUCTS array.
 */
function isTurfCartItem(item: CartItem): boolean {
  const product = PRODUCTS.find((p) => p.id === item.productId);
  if (!product) return false;
  return TURF_CATEGORIES.has(product.category);
}

/**
 * Return will-call locations that can fulfill ALL turf products in the cart.
 *
 * - Only turf products (landscape, pet, putting) matter.
 * - Accessories are ignored and never block will-call.
 * - A location is eligible only if every distinct turf productId in the
 *   cart appears in that location's productIds list.
 * - If the cart has zero turf items, returns empty (will-call is turf-only).
 */
export function getEligibleWillCallLocations(
  cartItems: CartItem[]
): WillCallLocation[] {
  const turfProductIds = new Set<string>();
  for (const item of cartItems) {
    if (isTurfCartItem(item)) {
      turfProductIds.add(item.productId);
    }
  }

  if (turfProductIds.size === 0) return [];

  return WILL_CALL_LOCATIONS.filter((location) => {
    const locationStock = new Set(location.productIds);
    for (const pid of turfProductIds) {
      if (!locationStock.has(pid)) return false;
    }
    return true;
  });
}
