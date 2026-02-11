import { ExecArgs } from "@medusajs/framework/types";

/**
 * Check Product Metadata
 *
 * Verifies what metadata is actually stored in the database
 */
export default async function checkMetadata({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const query = container.resolve("query") as any;

  logger.info("Fetching product metadata...");

  try {
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "metadata",
        "variants.id",
        "variants.metadata",
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
      logger.info(`\nProduct: ${product.title}`);
      logger.info(`  Metadata: ${JSON.stringify(product.metadata, null, 2)}`);

      for (const variant of product.variants || []) {
        logger.info(`\n  Variant: ${variant.id}`);
        logger.info(`    Metadata: ${JSON.stringify(variant.metadata, null, 2)}`);
      }
    }
  } catch (error) {
    logger.error("Failed to fetch metadata");
    if (error instanceof Error) {
      logger.error(error.message);
      logger.error(error.stack);
    }
    throw error;
  }
}
