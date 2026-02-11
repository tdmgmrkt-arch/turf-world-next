import { medusa, PUBLISHABLE_API_KEY } from "./medusa-client";
import {
  transformMedusaProduct,
  transformMedusaAccessory,
  isAccessory,
} from "./medusa-adapters";
import type { Product, Accessory, ProductCategory, ProductUse } from "./products";

/**
 * Medusa Product API Fetchers
 *
 * These functions fetch product data from the Medusa backend API
 * and transform it to match the existing Product/Accessory interfaces.
 *
 * Function signatures match the original helper functions from lib/products.ts
 * so they can be drop-in replacements with zero code changes in components.
 */

/**
 * Fetch all turf products from Medusa
 *
 * Uses extended API endpoint to get full product metadata including
 * turf specifications (weight, pile height, backing, etc.)
 *
 * Filters out accessories and returns only turf products
 * (landscape, pet, putting greens)
 */
export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const response = await medusa.products.listExtended({
      limit: 100, // Get all products
    });

    return response.products
      .filter((p: any) => !isAccessory(p))
      .map(transformMedusaProduct)
      .sort((a, b) => {
        // Sort: featured first, then by weight
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.weight - b.weight;
      });
  } catch (error) {
    console.error("Failed to fetch products from Medusa:", error);
    return []; // Return empty array on error
  }
}

/**
 * Fetch all accessories/supplies from Medusa
 *
 * Uses extended API to get full metadata
 * Filters for products in the "supplies" collection
 */
export async function fetchAllAccessories(): Promise<Accessory[]> {
  try {
    const response = await medusa.products.listExtended({
      limit: 100,
    });

    return response.products
      .filter((p: any) => isAccessory(p))
      .map(transformMedusaAccessory);
  } catch (error) {
    console.error("Failed to fetch accessories from Medusa:", error);
    return [];
  }
}

/**
 * Get a single product by its handle
 *
 * Uses extended API to get full metadata
 * Matches signature: getProductByHandle(handle: string): Product | undefined
 */
export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  try {
    const response = await medusa.products.listExtended({
      handle: handle,
      limit: 1,
    });

    if (response.products.length === 0) {
      return undefined;
    }

    const medusaProduct = response.products[0];

    // Only return if it's a turf product, not an accessory
    if (isAccessory(medusaProduct)) {
      return undefined;
    }

    return transformMedusaProduct(medusaProduct);
  } catch (error) {
    console.error(`Failed to fetch product with handle "${handle}":`, error);
    return undefined;
  }
}

/**
 * Get a single accessory by its handle
 *
 * Uses extended API to get full metadata
 * Matches signature: getAccessoryByHandle(handle: string): Accessory | undefined
 */
export async function getAccessoryByHandle(handle: string): Promise<Accessory | undefined> {
  try {
    const response = await medusa.products.listExtended({
      handle: handle,
      limit: 1,
    });

    if (response.products.length === 0) {
      return undefined;
    }

    const medusaProduct = response.products[0];

    // Only return if it's an accessory
    if (!isAccessory(medusaProduct)) {
      return undefined;
    }

    return transformMedusaAccessory(medusaProduct);
  } catch (error) {
    console.error(`Failed to fetch accessory with handle "${handle}":`, error);
    return undefined;
  }
}

/**
 * Get products filtered by category
 *
 * Matches signature: getProductsByCategory(category: ProductCategory): Product[]
 */
export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const allProducts = await fetchAllProducts();
  return allProducts.filter(p => p.category === category);
}

/**
 * Get products filtered by use case
 *
 * Matches signature: getProductsByUse(use: ProductUse): Product[]
 */
export async function getProductsByUse(use: ProductUse): Promise<Product[]> {
  const allProducts = await fetchAllProducts();
  return allProducts.filter(p => p.uses.includes(use));
}

/**
 * Get featured products only
 *
 * Matches signature: getFeaturedProducts(): Product[]
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const allProducts = await fetchAllProducts();
  return allProducts.filter(p => p.featured);
}

/**
 * Get accessories filtered by category
 *
 * Matches signature: getAccessoriesByCategory(category): Accessory[]
 */
export async function getAccessoriesByCategory(
  category: "infill" | "seaming" | "installation" | "tools"
): Promise<Accessory[]> {
  const allAccessories = await fetchAllAccessories();
  return allAccessories.filter(a => a.category === category);
}
