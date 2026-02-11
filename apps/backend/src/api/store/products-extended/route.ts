import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

/**
 * Extended Products API Route
 *
 * Exposes product metadata (including turf specifications) that the standard
 * Store API doesn't expose for security reasons.
 *
 * GET /store/products-extended
 * GET /store/products-extended/:id
 */

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve("query");
  const { id } = req.params;
  const { handle, region_id, collection_id, limit = 100, offset = 0 } = req.query;

  try {
    // Try to resolve pricing module, but don't fail if unavailable
    let pricingModule: any = null;
    try {
      pricingModule = req.scope.resolve("pricingModuleService");
    } catch (e) {
      console.warn("Pricing module not available, using base prices");
    }
    // Build filters
    const filters: any = {};
    if (id) {
      filters.id = id;
    }
    if (handle) {
      filters.handle = handle;
    }
    if (collection_id) {
      filters.collection_id = collection_id;
    }

    // Query products with all fields including metadata
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "handle",
        "title",
        "subtitle",
        "description",
        "status",
        "metadata",
        "collection_id",
        "collection.handle",
        "collection.title",
        "variants.id",
        "variants.title",
        "variants.sku",
        "variants.metadata",
        "variants.inventory_quantity",
        "variants.prices.id",
        "variants.prices.amount",
        "variants.prices.currency_code",
        "variants.prices.region_id",
        "images.url",
        "tags.value",
      ],
      filters,
      pagination: {
        skip: Number(offset),
        take: Number(limit),
      },
    });

    // Calculate promotional pricing for all variants
    const productsWithPricing = await Promise.all(
      products.map(async (product: any) => {
        const variantsWithPricing = await Promise.all(
          (product.variants || []).map(async (variant: any) => {
            const basePrice = variant.prices?.[0];
            let calculatedPrice = null;
            let originalPrice = null;
            let hasPromotion = false;

            if (basePrice && region_id && pricingModule) {
              try {
                // Calculate price with promotions applied (if pricing module available)
                const priceSet = await pricingModule.calculatePrices(
                  { id: [basePrice.id] },
                  {
                    context: {
                      currency_code: "usd",
                      region_id: region_id as string,
                    },
                  }
                );

                const calculated = priceSet?.[basePrice.id];
                if (calculated) {
                  calculatedPrice = {
                    calculated_amount: calculated.calculated_amount,
                    currency_code: calculated.currency_code || "usd",
                  };

                  // Check if there's a promotion applied
                  if (calculated.original_amount && calculated.original_amount !== calculated.calculated_amount) {
                    hasPromotion = true;
                    originalPrice = {
                      calculated_amount: calculated.original_amount,
                      currency_code: calculated.currency_code || "usd",
                    };
                  }
                }
              } catch (pricingError) {
                console.warn(`Failed to calculate pricing for variant ${variant.id}:`, pricingError);
                // Fallback to base price
                calculatedPrice = {
                  calculated_amount: basePrice.amount,
                  currency_code: basePrice.currency_code,
                };
              }
            } else if (basePrice) {
              // No region provided or pricing module unavailable, use base price
              calculatedPrice = {
                calculated_amount: basePrice.amount,
                currency_code: basePrice.currency_code,
              };
            }

            return {
              ...variant,
              calculated_price: calculatedPrice,
              original_price: hasPromotion ? originalPrice : null,
            };
          })
        );

        return {
          ...product,
          variants: variantsWithPricing,
        };
      })
    );

    res.json({
      products: productsWithPricing,
      count: productsWithPricing.length,
    });
  } catch (error) {
    console.error("Error fetching extended products:", error);
    res.status(500).json({
      error: "Failed to fetch products",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
