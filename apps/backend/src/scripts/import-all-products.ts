import { ExecArgs } from "@medusajs/framework/types";
import { createProductsWorkflow, createCollectionsWorkflow, deleteProductsWorkflow } from "@medusajs/medusa/core-flows";
import { ProductStatus } from "@medusajs/framework/utils";
import { readFileSync } from "fs";
import { join } from "path";

// Default region ID for pricing (United States)
const DEFAULT_REGION_ID = process.env.MEDUSA_REGION_ID || "reg_01KH2BZEE8K83YZTDS8TKW664W";
// Store image paths as relative paths — the storefront adapter handles URL resolution
const IMAGE_BASE_URL = "";

/**
 * Import All Products from Storefront
 *
 * Run: npm run import-products
 *
 * Imports all 40+ products from apps/storefront/lib/products.ts
 * into the Medusa backend database.
 */
export default async function importAllProducts({ container }: ExecArgs) {
  const logger = container.resolve("logger");

  logger.info("Starting product import from storefront...");

  // Read products from JSON file
  const productsFilePath = join(__dirname, "../../../../products-data.json");
  logger.info(`Reading products from: ${productsFilePath}`);

  const productsData = JSON.parse(readFileSync(productsFilePath, "utf-8"));
  const PRODUCTS = productsData.products;
  const ACCESSORIES = productsData.accessories;

  logger.info(`Found ${PRODUCTS.length} turf products and ${ACCESSORIES.length} accessories`);

  // ================================================
  // 1. GET OR CREATE COLLECTIONS
  // ================================================
  logger.info("Fetching or creating product collections...");

  const query = container.resolve("query") as any;

  // Try to fetch existing collections first
  const { data: existingCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "handle"],
  });

  let collections = existingCollections;

  // If no collections exist, create them
  if (!collections || collections.length === 0) {
    logger.info("No collections found. Creating new collections...");
    const { result: newCollections } = await createCollectionsWorkflow(container).run({
      input: {
        collections: [
          {
            title: "Landscape Turf",
            handle: "landscape",
            metadata: {
              description: "Professional-grade landscape artificial grass",
              sort_order: 1,
            },
          },
          {
            title: "Pet Turf",
            handle: "pet",
            metadata: {
              description: "Pet-friendly artificial grass with superior drainage",
              sort_order: 2,
            },
          },
          {
            title: "Putting Greens",
            handle: "putting",
            metadata: {
              description: "Golf putting green turf",
              sort_order: 3,
            },
          },
          {
            title: "Installation Supplies",
            handle: "supplies",
            metadata: {
              description: "Turf installation materials and accessories",
              sort_order: 4,
            },
          },
        ],
      },
    });
    collections = newCollections;
  } else {
    logger.info(`Found ${collections.length} existing collections. Skipping creation.`);
  }

  // Create a map of category -> collection ID
  const collectionMap: Record<string, string> = {};
  for (const collection of collections) {
    collectionMap[collection.handle] = collection.id;
  }

  logger.info(`✅ Using ${collections.length} collections`);

  // Get default shipping profile (required for cart completion)
  const fulfillmentModule = container.resolve("fulfillment") as any;
  const shippingProfiles = await fulfillmentModule.listShippingProfiles();
  const defaultProfile = shippingProfiles.find((p: any) => p.type === "default") || shippingProfiles[0];
  const shippingProfileId = defaultProfile?.id;
  if (shippingProfileId) {
    logger.info(`Using shipping profile: "${defaultProfile.name}" (${shippingProfileId})`);
  } else {
    logger.warn("No shipping profile found — products will not be shippable!");
  }

  // ================================================
  // 2. CONVERT TURF PRODUCTS TO MEDUSA FORMAT
  // ================================================
  const medusaProducts = PRODUCTS.map((product: any) => {
    // Determine collection based on category
    let collectionHandle = "landscape"; // default
    if (product.category === "pet") {
      collectionHandle = "pet";
    } else if (product.category === "putting") {
      collectionHandle = "putting";
    }

    return {
      title: product.name,
      handle: product.handle,
      subtitle: `${product.weight}oz Total Weight | ${product.pileHeight}" Pile Height`,
      collection_id: collectionMap[collectionHandle],
      ...(shippingProfileId && { shipping_profile_id: shippingProfileId }),
    description: `
${product.description}

**Specifications:**
- Total Weight: ${product.weight} oz
- Pile Height: ${product.pileHeight} inches
- Backing: ${product.backing}
- Warranty: ${product.warranty}
- Roll Size: ${product.rollSize}

${product.badge ? `**${product.badge}** - ` : ""}Professional-grade artificial turf, shipped nationwide.
    `.trim(),
    status: product.inStock ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
    is_giftcard: false,
    discountable: true,
    // TODO: Enable tags after creating them first
    // tags: product.tags.map((tag: string) => ({ value: tag })),
    // categories: [
    //   {
    //     name: getCategoryName(product.category),
    //     handle: `${product.category}-turf`,
    //   },
    // ],
    // Create variants - for now, single variant per product (can expand later)
    options: [
      {
        title: "Size",
        values: ["15' x 100' Roll"],
      },
    ],
    variants: [
      {
        title: `${product.name} - Standard Roll`,
        sku: `${product.id.toUpperCase()}-100`,
        prices: [
          {
            // priceCents is the per-sq-ft price in cents (e.g. 259 = $2.59/sqft).
            // Medusa v2 amounts are in major currency units, so divide by 100.
            amount: product.priceCents / 100,
            currency_code: "usd",
            region_id: DEFAULT_REGION_ID,
          },
        ],
        options: { Size: "15' x 100' Roll" },
        // Turf is sold by the sq ft — disable inventory tracking so
        // large-area orders (e.g. 1500 sq ft) aren't blocked.
        manage_inventory: false,
        allow_backorder: true,
        // Store compare price in metadata if exists
        ...(product.comparePriceCents && {
          metadata: {
            compare_at_price: product.comparePriceCents / 100,
          },
        }),
      },
    ],
    // Store all turf-specific attributes in metadata
    metadata: {
      // Original product data
      original_id: product.id,
      category: product.category,
      uses: product.uses,
      featured: product.featured || false,
      badge: product.badge,
      badge_color: product.badgeColor,

      // Turf attributes (for future TurfAttributes migration)
      turf_attributes: {
        pile_height: product.pileHeight,
        face_weight: product.weight,
        roll_width: 15,
        backing_type: product.backing.toLowerCase().includes("permeable")
          ? "permeable"
          : product.backing.toLowerCase().includes("perforated")
          ? "perforated"
          : "solid",
        warranty_years: parseInt(product.warranty.match(/\d+/)?.[0] || "15"),
        primary_use: product.category,
        pet_friendly: product.category === "pet" || product.uses.includes("pet"),
        golf_optimized: product.category === "putting",
        has_thatch: product.pileHeight > 1, // Assume taller turf has thatch
        // Assume PFAS-free and lead-free for all products (update if needed)
        pfas_free: true,
        lead_free: true,
        fire_rating: "Class_A", // Default, update in metadata later if needed
      },
    },
      // Images - reference from storefront public folder
      images: product.images.map((imgPath: string) => ({
        url: `${IMAGE_BASE_URL}${imgPath}`,
      })),
    };
  });

  // ================================================
  // 3. CONVERT ACCESSORIES TO MEDUSA FORMAT
  // ================================================
  const medusaAccessories = ACCESSORIES.map((accessory: any) => ({
    title: accessory.name,
    handle: accessory.handle,
    subtitle: accessory.size,
    description: accessory.description,
    collection_id: collectionMap["supplies"], // All accessories go to supplies collection
    ...(shippingProfileId && { shipping_profile_id: shippingProfileId }),
    status: accessory.inStock ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
    is_giftcard: false,
    discountable: true,
    // TODO: Enable tags after creating them first
    // tags: accessory.tags.map((tag: string) => ({ value: tag })),
    // categories: [
    //   {
    //     name: getCategoryName(accessory.category),
    //     handle: `${accessory.category}`,
    //   },
    // ],
    // Add options for accessories
    options: [
      {
        title: "Size",
        values: [accessory.size],
      },
    ],
    variants: [
      {
        title: `${accessory.name} - ${accessory.size}`,
        sku: `${accessory.id.toUpperCase()}`,
        prices: [
          {
            amount: accessory.priceCents / 100,
            currency_code: "usd",
            region_id: DEFAULT_REGION_ID,
          },
        ],
        options: { Size: accessory.size },
        manage_inventory: false,
        allow_backorder: true,
      },
    ],
    metadata: {
      original_id: accessory.id,
      category: accessory.category,
      size: accessory.size,
      badge: accessory.badge,
      badge_color: accessory.badgeColor,
    },
    images: accessory.images.map((imgPath: string) => ({
      url: `${IMAGE_BASE_URL}${imgPath}`,
    })),
  }));

  // ================================================
  // 4. DELETE EXISTING PRODUCTS (so reimport gets fresh prices)
  // ================================================
  const allHandles = [...PRODUCTS, ...ACCESSORIES].map((p: any) => p.handle);
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: allHandles },
  });

  if (existingProducts.length > 0) {
    logger.info(`Deleting ${existingProducts.length} existing products for reimport...`);
    await deleteProductsWorkflow(container).run({
      input: { ids: existingProducts.map((p: any) => p.id) },
    });
    logger.info(`✅ Deleted ${existingProducts.length} products`);

    // Also clean up turf_attributes for deleted products
    try {
      const turfAttributesService = container.resolve("turf_attributes") as any;
      const existingIds = existingProducts.map((p: any) => p.id);
      const existingAttrs = await turfAttributesService.listTurfAttributes({
        product_id: existingIds,
      });
      if (existingAttrs.length > 0) {
        await turfAttributesService.deleteTurfAttributes(
          existingAttrs.map((a: any) => a.id)
        );
        logger.info(`✅ Deleted ${existingAttrs.length} turf attribute records`);
      }
    } catch (err: any) {
      logger.warn(`Could not clean up turf attributes: ${err.message}`);
    }
  } else {
    logger.info("No existing products found — fresh import");
  }

  // ================================================
  // 5. BATCH CREATE ALL PRODUCTS
  // ================================================
  const allProducts = [...medusaProducts, ...medusaAccessories];

  logger.info(`Creating ${allProducts.length} products in Medusa...`);

  try {
    const { result } = await createProductsWorkflow(container).run({
      input: {
        products: allProducts,
      },
    });

    logger.info(`✅ Successfully imported ${result.length} products!`);

    // ================================================
    // 6. CREATE TURF ATTRIBUTES FOR TURF PRODUCTS
    // ================================================
    logger.info("Creating turf attributes for products...");

    const turfAttributesService = container.resolve("turf_attributes") as any;

    // Only create turf attributes for actual turf products (not accessories)
    let turfCount = 0;
    for (let i = 0; i < PRODUCTS.length; i++) {
      const product = PRODUCTS[i];
      const createdProduct = result[i]; // Corresponding created product

      await turfAttributesService.createTurfAttributes({
        product_id: createdProduct.id,
        pile_height: product.pileHeight,
        face_weight: product.weight,
        roll_width: 15,
        backing_type: product.backing.toLowerCase().includes("permeable")
          ? "permeable"
          : product.backing.toLowerCase().includes("perforated")
          ? "perforated"
          : "solid",
        warranty_years: parseInt(product.warranty.match(/\d+/)?.[0] || "15"),
        primary_use: product.category,
        pet_friendly: product.category === "pet" || product.uses.includes("pet"),
        golf_optimized: product.category === "putting",
        has_thatch: product.pileHeight > 1,
        pfas_free: true,
        lead_free: true,
        fire_rating: "Class_A",
      });
      turfCount++;
    }

    logger.info(`✅ Created ${turfCount} turf attribute records`);

    logger.info("");
    logger.info("Product import complete!");
    logger.info("Access your admin dashboard at: http://localhost:9000/app");
    logger.info("View products in the Products section.");
  } catch (error) {
    logger.error("Failed to import products");
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw error;
  }
}

/**
 * Helper: Get category display name
 */
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    landscape: "Landscape Turf",
    pet: "Pet Turf",
    putting: "Putting Greens",
    accessory: "Accessories",
    infill: "Infill",
    seaming: "Seaming Supplies",
    installation: "Installation Supplies",
    tools: "Tools",
  };

  return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
}
