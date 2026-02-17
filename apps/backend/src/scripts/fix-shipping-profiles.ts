import { ExecArgs } from "@medusajs/framework/types";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Fix Shipping Profiles
 *
 * Links all products to the default shipping profile.
 * The import script creates products without shipping_profile_id,
 * so they have no profile assigned. Cart completion requires every
 * product to have a shipping profile matching a shipping method.
 *
 * Run: npx medusa exec ./src/scripts/fix-shipping-profiles.ts
 */
export default async function fixShippingProfiles({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const fulfillmentModule = container.resolve("fulfillment") as any;
  const productModule = container.resolve("product") as any;
  const link = container.resolve(ContainerRegistrationKeys.LINK) as any;
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as any;

  logger.info("Fixing shipping profiles for all products...");

  // 1. Find the default shipping profile
  const profiles = await fulfillmentModule.listShippingProfiles();
  const defaultProfile = profiles.find((p: any) => p.type === "default") || profiles[0];
  if (!defaultProfile) {
    logger.error("No shipping profiles found!");
    return;
  }
  logger.info(`Default shipping profile: "${defaultProfile.name}" (${defaultProfile.id})`);

  // 2. List all products
  const products = await productModule.listProducts({}, { take: 500 });
  logger.info(`Found ${products.length} products`);

  // 3. Check which products already have a shipping profile link
  let linked = 0;
  let alreadyLinked = 0;

  for (const product of products) {
    try {
      // Query for existing link
      const { data: productWithProfile } = await query.graph({
        entity: "product",
        fields: ["id", "shipping_profile.*"],
        filters: { id: product.id },
      });

      const hasProfile = productWithProfile?.[0]?.shipping_profile?.id;

      if (hasProfile) {
        alreadyLinked++;
        continue;
      }

      // Create link to default shipping profile
      await link.create({
        [Modules.PRODUCT]: { product_id: product.id },
        [Modules.FULFILLMENT]: { shipping_profile_id: defaultProfile.id },
      });
      linked++;
    } catch (err: any) {
      // Link might already exist — ignore duplicate errors
      if (err.message?.includes("already exists") || err.code === "23505") {
        alreadyLinked++;
      } else {
        logger.warn(`Failed to link product ${product.id}: ${err.message}`);
      }
    }
  }

  logger.info(`Done! Linked ${linked} products to "${defaultProfile.name}". ${alreadyLinked} already had a profile.`);
}
