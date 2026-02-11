"use client";

import { useState, useEffect, useMemo } from "react";
import { PRODUCTS, ACCESSORIES, type Product, type Accessory } from "@/lib/products";
import {
  fetchAllProducts,
  fetchAllAccessories,
} from "@/lib/medusa-products";
import { USE_MEDUSA_API } from "@/lib/medusa-client";

// Calculator-specific turf option type
export interface TurfOption {
  id: string;
  productHandle: string;
  name: string;
  pricePerSqFtCents: number; // Source of truth from PRODUCTS.priceCents
  description: string;
  isPet: boolean;
  badge: string;
  color: "emerald" | "amber" | "blue";
}

export interface UseTurfOptionsReturn {
  presetOptions: TurfOption[];      // Featured products (replaces TURF_OPTIONS)
  otherProducts: Product[];          // Non-featured for dropdown
  accessories: Accessory[];          // For materials list
  isLoading: boolean;                // Loading state
  getProduct: (handle: string) => Product | undefined; // Sync lookup
}

/**
 * Transform Product to TurfOption for calculator UI
 */
function transformToTurfOption(product: Product): TurfOption {
  const isPet = product.category === "pet";

  // Derive badge color from category
  let color: "emerald" | "amber" | "blue" = "emerald";
  if (isPet) color = "amber";
  else if (product.category === "putting") color = "blue";

  return {
    id: product.handle,
    productHandle: product.handle,
    name: product.name,
    pricePerSqFtCents: product.priceCents, // ← KEY: Pull from PRODUCTS
    description: `${product.weight}oz, ${product.pileHeight}" pile`,
    isPet,
    badge: product.badge || "",
    color,
  };
}

/**
 * Hook to fetch and transform turf options for calculator
 * Handles both PRODUCTS array and Medusa API based on USE_MEDUSA_API flag
 */
export function useTurfOptions(): UseTurfOptionsReturn {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [accessories, setAccessories] = useState<Accessory[]>(ACCESSORIES);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch from API if enabled
  useEffect(() => {
    if (USE_MEDUSA_API) {
      setIsLoading(true);
      Promise.all([
        fetchAllProducts(),
        fetchAllAccessories(),
      ])
        .then(([prods, accs]) => {
          setProducts(prods);
          setAccessories(accs);
        })
        .catch((error) => {
          console.error("Failed to fetch products:", error);
          // Fallback to hardcoded data on error
          setProducts(PRODUCTS);
          setAccessories(ACCESSORIES);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  // Derive preset options from featured products
  const presetOptions = useMemo(() => {
    const featured = products.filter(p => p.featured);

    // Sort: landscape → pet → putting, then by price
    const sorted = featured.sort((a, b) => {
      const categoryOrder = { landscape: 0, pet: 1, putting: 2, accessory: 999 };
      const orderA = categoryOrder[a.category] ?? 999;
      const orderB = categoryOrder[b.category] ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.priceCents - b.priceCents;
    });

    return sorted.map(transformToTurfOption);
  }, [products]);

  // Non-featured products for "Other Options" dropdown
  const otherProducts = useMemo(() => {
    return products.filter(p => !p.featured);
  }, [products]);

  // Sync helper for O(1) product lookup
  const getProduct = useMemo(() => {
    const productMap = new Map(products.map(p => [p.handle, p]));
    return (handle: string) => productMap.get(handle);
  }, [products]);

  return {
    presetOptions,
    otherProducts,
    accessories,
    isLoading,
    getProduct,
  };
}
