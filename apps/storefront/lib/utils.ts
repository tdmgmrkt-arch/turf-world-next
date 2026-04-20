import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in cents to display string
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/**
 * Format price per square foot
 */
export function formatPricePerSqFt(cents: number): string {
  return `${formatPrice(cents)}/sq ft`;
}

/**
 * Calculate square footage
 */
export function calculateSquareFeet(widthFeet: number, lengthFeet: number): number {
  return widthFeet * lengthFeet;
}

/**
 * Format a Medusa order's display_id as the customer-facing order number.
 * Offset of 10000 keeps the number feeling established rather than showing low sequential IDs.
 * Must match the formula in apps/backend/src/subscribers/order-placed-to-ghl.ts.
 */
export function formatOrderNumber(displayId: number | string | null | undefined): string {
  const n = Number(displayId);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `TW-${10000 + n}`;
}
