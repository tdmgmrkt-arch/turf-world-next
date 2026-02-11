import { ExecArgs } from "@medusajs/framework/types";
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows";

/**
 * Delete All Products
 *
 * Run: npx medusa exec ./src/scripts/delete-all-products.ts
 *
 * WARNING: This will delete ALL products from the database.
 * Use this to clean up before re-importing with updated pricing.
 */
export default async function deleteAllProducts({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const query = container.resolve("query") as any;

  logger.info("Fetching all products...");

  try {
    // Query all products using the query service
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle"],
      pagination: {
        take: 1000,
      },
    });

    if (!products || products.length === 0) {
      logger.info("No products found to delete.");
      return;
    }

    logger.info(`Found ${products.length} products. Starting deletion...`);

    // Delete all products using the workflow
    const productIds = products.map((p: any) => p.id);

    await deleteProductsWorkflow(container).run({
      input: {
        ids: productIds,
      },
    });

    logger.info(`✅ Successfully deleted ${products.length} products!`);
    logger.info("");
    logger.info("You can now re-run the import script:");
    logger.info("npm run import-products");
  } catch (error) {
    logger.error("Failed to delete products");
    if (error instanceof Error) {
      logger.error(error.message);
      logger.error(error.stack);
    }
    throw error;
  }
}
