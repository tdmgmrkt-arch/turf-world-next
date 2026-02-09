import { ExecArgs } from "@medusajs/framework/types";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { ProductStatus } from "@medusajs/framework/utils";
import { readFileSync } from "fs";
import { join } from "path";

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
  // 1. CREATE CATEGORIES
  // ================================================
  logger.info("Categories will be auto-created with products");

  // ================================================
  // 2. CONVERT TURF PRODUCTS TO MEDUSA FORMAT
  // ================================================
  const medusaProducts = PRODUCTS.map((product: any) => ({
    title: product.name,
    handle: product.handle,
    subtitle: `${product.weight}oz Total Weight | ${product.pileHeight}" Pile Height`,
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
    // tags: product.tags.map((tag: string) => ({ value: tag })), // Skip tags for now
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
            amount: product.priceCents,
            currency_code: "usd",
          },
        ],
        options: { Size: "15' x 100' Roll" },
        manage_inventory: true,
        inventory_quantity: product.inStock ? 1000 : 0,
        // Store compare price in metadata if exists
        ...(product.comparePriceCents && {
          metadata: {
            compare_at_price: product.comparePriceCents,
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
      url: `http://localhost:3008${imgPath}`, // Reference storefront images
    })),
  }));

  // ================================================
  // 3. CONVERT ACCESSORIES TO MEDUSA FORMAT
  // ================================================
  const medusaAccessories = ACCESSORIES.map((accessory: any) => ({
    title: accessory.name,
    handle: accessory.handle,
    subtitle: accessory.size,
    description: accessory.description,
    status: accessory.inStock ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
    is_giftcard: false,
    discountable: true,
    // tags: accessory.tags.map((tag: string) => ({ value: tag })), // Skip tags for now
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
            amount: accessory.priceCents,
            currency_code: "usd",
          },
        ],
        options: { Size: accessory.size },
        manage_inventory: true,
        inventory_quantity: accessory.inStock ? 500 : 0,
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
      url: `http://localhost:3008${imgPath}`,
    })),
  }));

  // ================================================
  // 4. BATCH CREATE ALL PRODUCTS
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
