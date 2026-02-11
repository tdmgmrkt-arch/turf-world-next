import { ExecArgs } from "@medusajs/framework/types";

/**
 * Setup default region for Turf World
 *
 * Creates a United States region with USD currency if one doesn't already exist.
 * This is required for Medusa v2 to return product prices via the Store API.
 *
 * Run: npx medusa exec ./src/scripts/setup-regions.ts
 */
export default async function setupRegions({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const remoteQuery = container.resolve("remoteQuery") as any;

  logger.info("Checking for existing regions...");

  // Check if region already exists using remote query
  const existingRegions = await remoteQuery.query({
    region: {
      fields: ["id", "name", "currency_code"],
    },
  });

  if (existingRegions && existingRegions.length > 0) {
    logger.info("✓ Regions already exist:");
    existingRegions.forEach((region: any) => {
      logger.info(`  - ${region.name} (${region.id}) - ${region.currency_code.toUpperCase()}`);
    });
    logger.info("");
    logger.info("Use the first region ID in your storefront .env.local:");
    logger.info(`NEXT_PUBLIC_MEDUSA_REGION_ID=${existingRegions[0].id}`);
    return;
  }

  logger.info("Creating default region...");

  // Use the region module to create a region
  const regionModule = container.resolve("@medusajs/medusa/region") as any;

  // Create United States region
  const region = await regionModule.createRegions({
    name: "United States",
    currency_code: "usd",
    countries: ["us"],
  });

  logger.info(`✓ Created region: ${region.name} (${region.id})`);
  logger.info(`  Currency: ${region.currency_code.toUpperCase()}`);
  logger.info("");
  logger.info("Next steps:");
  logger.info("1. Add this region ID to your storefront .env.local:");
  logger.info(`   NEXT_PUBLIC_MEDUSA_REGION_ID=${region.id}`);
  logger.info("2. Verify products have prices associated with this region");
  logger.info("3. Restart your storefront to see prices");

  return region;
}
