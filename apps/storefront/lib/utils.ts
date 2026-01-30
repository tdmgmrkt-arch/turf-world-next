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
