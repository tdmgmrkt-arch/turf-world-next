import { ExecArgs } from "@medusajs/framework/types";

/**
 * Check Product Prices
 *
 * Verifies what prices are actually stored in the database
 */
export default async function checkPrices({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const query = container.resolve("query") as any;

  logger.info("Fetching products and their prices...");

  try {
    // Query products with prices
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "variants.id",
        "variants.title",
        "variants.prices.amount",
        "variants.prices.currency_code",
        "variants.prices.region_id",
      ],
      filters: {
        handle: "turf-world-63",
      },
    });

    if (!products || products.length === 0) {
      logger.info("No products found.");
      return;
    }

    for (const product of products) {
      logger.info(`\nProduct: ${product.title} (${product.handle})`);

      for (const variant of product.variants || []) {
        logger.info(`  Variant: ${variant.title}`);
        logger.info(`    Prices:`);

        if (!variant.prices || variant.prices.length === 0) {
          logger.warn(`      ⚠️  No prices found!`);
        } else {
          for (const price of variant.prices) {
            const dollars = (price.amount / 100).toFixed(2);
            logger.info(`      - Amount: ${price.amount} cents ($${dollars})`);
            logger.info(`        Currency: ${price.currency_code}`);
            logger.info(`        Region: ${price.region_id || 'NONE'}`);
          }
        }
      }
    }
  } catch (error) {
    logger.error("Failed to fetch prices");
    if (error instanceof Error) {
      logger.error(error.message);
      logger.error(error.stack);
    }
    throw error;
  }
}
