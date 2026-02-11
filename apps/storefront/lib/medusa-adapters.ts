import { Product, Accessory } from "./products";

/**
 * Medusa API Data Adapters
 *
 * Transform Medusa API responses to match the storefront's
 * Product and Accessory interfaces. This ensures zero changes
 * to existing UI components.
 */

// Medusa Product type (simplified - using any for flexibility)
type MedusaProduct = any;

/**
 * Transform Medusa product to Storefront Product interface
 *
 * Maps Medusa's data structure to match the existing Product interface
 * used throughout the storefront. All turf-specific data comes from
 * product metadata.
 */
export function transformMedusaProduct(medusaProduct: MedusaProduct): Product {
  const variant = medusaProduct.variants?.[0]; // Default variant
  const metadata = medusaProduct.metadata || {};
  const turfAttrs = metadata.turf_attributes || {};
  const subtitle = medusaProduct.subtitle || "";
  const description = medusaProduct.description || "";

  // Get category from collection (collection is exposed by Store API)
  const collectionHandle = medusaProduct.collection?.handle || "landscape";

  // Helper to format backing type for display
  const formatBacking = (backingType?: string): string => {
    if (!backingType) return "Unknown";
    const backingMap: Record<string, string> = {
      permeable: "Permeable Polyurethane",
      perforated: "Perforated Polyurethane",
      solid: "Solid Polyurethane",
    };
    return backingMap[backingType] || backingType;
  };

  // Helper to format roll size
  const formatRollSize = (width?: number): string => {
    return width ? `${width}'W x 100'L` : "15'W x 100'L";
  };

  return {
    // Core identifiers
    id: metadata.original_id || medusaProduct.id,
    handle: medusaProduct.handle || "",
    name: medusaProduct.title || "",
    description: description,

    // Pricing (already in cents)
    // If original_price exists, product has an active promotion
    priceCents: variant?.calculated_price?.calculated_amount || 0,
    comparePriceCents: variant?.original_price?.calculated_amount || variant?.metadata?.compare_at_price,
    costCents: undefined, // Not exposed from Medusa

    // Category and classification (from collection)
    category: collectionHandle,
    uses: Array.isArray(metadata.uses) ? metadata.uses : [collectionHandle],

    // Turf specifications (read directly from metadata.turf_attributes)
    weight: turfAttrs.face_weight || 0,
    pileHeight: turfAttrs.pile_height || 0,
    backing: formatBacking(turfAttrs.backing_type),
    warranty: turfAttrs.warranty_years ? `${turfAttrs.warranty_years} Year` : "15 Year",
    rollSize: formatRollSize(turfAttrs.roll_width),

    // Images - convert Medusa URLs to local paths if needed
    images: (medusaProduct.images || []).map((img: any) => {
      const url = img.url || "";
      // If image URL is from localhost:3008, convert to path
      if (url.startsWith("http://localhost:3008")) {
        return url.replace("http://localhost:3008", "");
      }
      // If it's a full URL, return as-is
      if (url.startsWith("http")) {
        return url;
      }
      // If it's already a path, return as-is
      return url;
    }),

    // Tags
    tags: (medusaProduct.tags || []).map((tag: any) => tag.value),

    // Product badges
    badge: metadata.badge,
    badgeColor: metadata.badge_color,

    // Status
    inStock: medusaProduct.status === "published",
    featured: metadata.featured === true,
  };
}

/**
 * Transform Medusa product to Storefront Accessory interface
 *
 * Similar to product transformation but for accessories/supplies
 */
export function transformMedusaAccessory(medusaProduct: MedusaProduct): Accessory {
  const variant = medusaProduct.variants?.[0];
  const metadata = medusaProduct.metadata || {};

  return {
    // Core identifiers
    id: metadata.original_id || medusaProduct.id,
    handle: medusaProduct.handle || "",
    name: medusaProduct.title || "",
    description: medusaProduct.description || "",

    // Pricing
    // If original_price exists, product has an active promotion
    priceCents: variant?.calculated_price?.calculated_amount || 0,
    comparePriceCents: variant?.original_price?.calculated_amount,

    // Category
    category: metadata.category || "installation",

    // Size specification
    size: metadata.size || medusaProduct.subtitle || "",

    // Images
    images: (medusaProduct.images || []).map((img: any) => {
      const url = img.url || "";
      if (url.startsWith("http://localhost:3008")) {
        return url.replace("http://localhost:3008", "");
      }
      if (url.startsWith("http")) {
        return url;
      }
      return url;
    }),

    // Tags
    tags: (medusaProduct.tags || []).map((tag: any) => tag.value),

    // Badges
    badge: metadata.badge,
    badgeColor: metadata.badge_color,

    // Status
    inStock: medusaProduct.status === "published",
  };
}

/**
 * Check if a Medusa product is an accessory based on its collection
 */
export function isAccessory(medusaProduct: MedusaProduct): boolean {
  const collectionHandle = medusaProduct.collection?.handle;
  return collectionHandle === "supplies";
}
