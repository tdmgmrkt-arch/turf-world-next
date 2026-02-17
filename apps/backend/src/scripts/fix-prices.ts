import { ExecArgs } from "@medusajs/framework/types";

/**
 * Fix Product Prices
 *
 * The original import stored priceCents (e.g. 259) directly as the Medusa amount,
 * but Medusa v2 amounts are in major currency units (dollars, not cents).
 * So 259 became $259.00 instead of $2.59.
 *
 * This script divides all variant prices by 100 to fix them.
 * It's idempotent: only fixes prices > $10 (already-fixed prices like $2.59 are skipped).
 *
 * Run: npx medusa exec ./src/scripts/fix-prices.ts
 */
export default async function fixPrices({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const query = container.resolve("query") as any;
  const pricingModule = container.resolve("pricing") as any;

  logger.info("Fixing product prices (dividing by 100)...");

  // Get all products with their variants and prices
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "variants.*", "variants.prices.*"],
    filters: {},
  });

  let fixed = 0;
  let skipped = 0;

  for (const product of products) {
    for (const variant of product.variants || []) {
      for (const price of variant.prices || []) {
        // Only fix prices that look like they're in cents (> $10 threshold).
        // Already-fixed prices (e.g. $2.59) will be < $10 and skipped.
        if (price.amount > 10) {
          const oldAmount = price.amount;
          const newAmount = Math.round((price.amount / 100) * 100) / 100; // Round to 2 decimals

          try {
            await pricingModule.updatePrices([
              {
                id: price.id,
                amount: newAmount,
              },
            ]);
            logger.info(`  Fixed: ${product.title} — $${oldAmount} → $${newAmount}`);
            fixed++;
          } catch (err: any) {
            logger.warn(`  Failed to fix ${product.title} price ${price.id}: ${err.message}`);
          }
        } else {
          skipped++;
        }
      }
    }
  }

  logger.info(`Done! Fixed ${fixed} prices, skipped ${skipped} (already correct).`);
}
