import { ExecArgs } from "@medusajs/framework/types";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createLocationFulfillmentSetWorkflow,
  createServiceZonesWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  createShippingOptionsWorkflow,
  deleteShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Post-Deploy Setup — runs once per container start.
 *
 * Consolidates all fix/seed scripts into a single Medusa exec call
 * so the framework only bootstraps once (saves ~4-5 min on Railway).
 *
 * Steps:
 *  1. Fix prices (÷100 for any that are still in cents)
 *  2. Fix shipping profiles (link products to default profile)
 *  3. Seed shipping (stock location, fulfillment set, shipping options)
 *  4. Fix inventory (high stock levels + sales channel links)
 *
 * Run: npx medusa exec ./src/scripts/post-deploy.ts
 */
export default async function postDeploy({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;

  logger.info("=== POST-DEPLOY SETUP START ===");

  try {
    await fixPrices(container, logger);
  } catch (err: any) {
    logger.warn("fix-prices error (continuing): " + err.message);
  }

  try {
    await fixShippingProfiles(container, logger);
  } catch (err: any) {
    logger.warn("fix-shipping-profiles error (continuing): " + err.message);
  }

  try {
    await seedShipping(container, logger);
  } catch (err: any) {
    logger.warn("seed-shipping error (continuing): " + err.message);
  }

  try {
    await fixInventory(container, logger);
  } catch (err: any) {
    logger.warn("fix-inventory error (continuing): " + err.message);
  }

  logger.info("=== POST-DEPLOY SETUP COMPLETE ===");
}

// ─── 1. FIX PRICES ────────────────────────────────────────────────
async function fixPrices(container: any, logger: any) {
  const query = container.resolve("query") as any;
  const pricingModule = container.resolve("pricing") as any;

  logger.info("[fix-prices] Checking for prices still in cents...");

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
        if (price.amount > 10) {
          const newAmount = Math.round((price.amount / 100) * 100) / 100;
          try {
            await pricingModule.updatePrices([{ id: price.id, amount: newAmount }]);
            fixed++;
          } catch (err: any) {
            logger.warn(`  Failed to fix ${product.title} price: ${err.message}`);
          }
        } else {
          skipped++;
        }
      }
    }
  }

  logger.info(`[fix-prices] Fixed ${fixed}, skipped ${skipped} (already correct)`);
}

// ─── 2. FIX SHIPPING PROFILES ─────────────────────────────────────
async function fixShippingProfiles(container: any, logger: any) {
  const fulfillmentModule = container.resolve("fulfillment") as any;
  const productModule = container.resolve("product") as any;
  const link = container.resolve(ContainerRegistrationKeys.LINK) as any;
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as any;

  logger.info("[fix-shipping-profiles] Linking products to default profile...");

  const profiles = await fulfillmentModule.listShippingProfiles();
  const defaultProfile = profiles.find((p: any) => p.type === "default") || profiles[0];
  if (!defaultProfile) {
    logger.warn("[fix-shipping-profiles] No shipping profiles found — skipping");
    return;
  }

  const products = await productModule.listProducts({}, { take: 500 });
  let linked = 0;
  let alreadyLinked = 0;

  for (const product of products) {
    try {
      const { data: productWithProfile } = await query.graph({
        entity: "product",
        fields: ["id", "shipping_profile.*"],
        filters: { id: product.id },
      });

      if (productWithProfile?.[0]?.shipping_profile?.id) {
        alreadyLinked++;
        continue;
      }

      await link.create({
        [Modules.PRODUCT]: { product_id: product.id },
        [Modules.FULFILLMENT]: { shipping_profile_id: defaultProfile.id },
      });
      linked++;
    } catch (err: any) {
      if (err.message?.includes("already exists") || err.code === "23505") {
        alreadyLinked++;
      } else {
        logger.warn(`  Failed to link product ${product.id}: ${err.message}`);
      }
    }
  }

  logger.info(`[fix-shipping-profiles] Linked ${linked}, ${alreadyLinked} already had profile`);
}

// ─── 3. SEED SHIPPING ─────────────────────────────────────────────
async function seedShipping(container: any, logger: any) {
  const fulfillmentModule = container.resolve("fulfillment") as any;
  const stockLocationModule = container.resolve("stock_location") as any;
  const salesChannelModule = container.resolve("sales_channel") as any;

  logger.info("[seed-shipping] Ensuring shipping infrastructure...");

  // Stock location
  let stockLocations = await stockLocationModule.listStockLocations({});
  let location: any;

  if (stockLocations.length === 0) {
    const { result: locations } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [{
          name: "Main Warehouse",
          address: {
            address_1: "123 Main St",
            city: "Los Angeles",
            country_code: "US",
            province: "CA",
            postal_code: "90001",
          },
        }],
      },
    });
    location = locations[0];

    const salesChannels = await salesChannelModule.listSalesChannels({});
    if (salesChannels.length > 0) {
      const defaultChannel = salesChannels.find((sc: any) => sc.is_default) || salesChannels[0];
      await linkSalesChannelsToStockLocationWorkflow(container).run({
        input: { id: location.id, add: [defaultChannel.id] },
      });
    }
    logger.info(`[seed-shipping] Created stock location: ${location.id}`);
  } else {
    location = stockLocations[0];
  }

  // Shipping profile
  const profiles = await fulfillmentModule.listShippingProfiles();
  if (profiles.length === 0) {
    logger.warn("[seed-shipping] No shipping profiles — skipping");
    return;
  }

  // Fulfillment set
  const existingSets = await fulfillmentModule.listFulfillmentSets(
    {},
    { relations: ["service_zones", "service_zones.geo_zones"] }
  );

  let fulfillmentSetId: string;
  let serviceZoneId: string | null = null;

  if (existingSets.length > 0) {
    const shippingSet = existingSets.find((fs: any) => fs.type === "shipping") || existingSets[0];
    fulfillmentSetId = shippingSet.id;
    if (shippingSet.service_zones?.length > 0) {
      serviceZoneId = shippingSet.service_zones[0].id;
    }
  } else {
    const workflowResult = await createLocationFulfillmentSetWorkflow(container).run({
      input: {
        location_id: location.id,
        fulfillment_set_data: { name: "Shipping", type: "shipping" },
      },
    });
    const fulfillmentSet = workflowResult.result as any;
    if (fulfillmentSet?.id) {
      fulfillmentSetId = fulfillmentSet.id;
    } else {
      const newSets = await fulfillmentModule.listFulfillmentSets({});
      fulfillmentSetId = newSets[0]?.id;
      if (!fulfillmentSetId) {
        logger.error("[seed-shipping] Failed to create fulfillment set");
        return;
      }
    }
  }

  // Service zone
  if (!serviceZoneId) {
    const { result: serviceZones } = await createServiceZonesWorkflow(container).run({
      input: {
        data: [{
          name: "United States",
          fulfillment_set_id: fulfillmentSetId,
          geo_zones: [{ type: "country" as const, country_code: "us" }],
        }],
      },
    });
    serviceZoneId = (serviceZones as any)[0].id;
  }

  // Fulfillment provider
  let providerId = "manual_manual";
  try {
    const providers = await fulfillmentModule.listFulfillmentProviders();
    const manual = providers.find((p: any) => p.id.includes("manual"));
    if (manual) providerId = manual.id;
  } catch { /* use default */ }

  // Shipping options per profile
  for (const profile of profiles) {
    const existingForProfile = await fulfillmentModule.listShippingOptions({
      service_zone_id: serviceZoneId,
      shipping_profile_id: profile.id,
    });

    if (existingForProfile.length > 0) {
      let hasPrices = false;
      try {
        const query = container.resolve("query") as any;
        const { data: withPrices } = await query.graph({
          entity: "shipping_option",
          fields: ["id", "prices.*"],
          filters: { id: existingForProfile.map((o: any) => o.id) },
        });
        hasPrices = withPrices.some((o: any) => o.prices?.length > 0);
      } catch { /* ignore */ }

      if (hasPrices) continue;

      try {
        await deleteShippingOptionsWorkflow(container).run({
          input: { ids: existingForProfile.map((o: any) => o.id) },
        });
      } catch { /* ignore */ }
    }

    try {
      await createShippingOptionsWorkflow(container).run({
        input: [{
          name: `Standard Shipping (${profile.name})`,
          price_type: "flat",
          service_zone_id: serviceZoneId,
          shipping_profile_id: profile.id,
          provider_id: providerId,
          type: {
            label: "Standard",
            description: "Standard ground shipping",
            code: `standard-${profile.id}`,
          },
          prices: [{ currency_code: "usd", amount: 0 }],
          rules: [],
        }],
      });
    } catch (err: any) {
      logger.error(`[seed-shipping] Failed for profile "${profile.name}": ${err.message}`);
    }
  }

  logger.info("[seed-shipping] Done");
}

// ─── 4. FIX INVENTORY ─────────────────────────────────────────────
async function fixInventory(container: any, logger: any) {
  const stockLocationModule = container.resolve("stock_location") as any;
  const salesChannelModule = container.resolve("sales_channel") as any;
  const inventoryModule = container.resolve("inventory") as any;

  logger.info("[fix-inventory] Ensuring stock levels...");

  const stockLocations = await stockLocationModule.listStockLocations({});
  if (stockLocations.length === 0) {
    logger.warn("[fix-inventory] No stock locations — skipping");
    return;
  }
  const location = stockLocations[0];

  // Link all sales channels
  const salesChannels = await salesChannelModule.listSalesChannels({});
  if (salesChannels.length > 0) {
    try {
      await linkSalesChannelsToStockLocationWorkflow(container).run({
        input: { id: location.id, add: salesChannels.map((sc: any) => sc.id) },
      });
    } catch { /* may already be linked */ }
  }

  // Create/update inventory levels
  const inventoryItems = await inventoryModule.listInventoryItems(
    {},
    { relations: ["location_levels"], take: 500 }
  );

  let created = 0;
  let updated = 0;
  for (const item of inventoryItems) {
    const existingLevel = item.location_levels?.find(
      (ll: any) => ll.location_id === location.id
    );

    if (existingLevel) {
      if (existingLevel.stocked_quantity < 999999) {
        try {
          await inventoryModule.updateInventoryLevels(existingLevel.id, {
            stocked_quantity: 999999,
          });
          updated++;
        } catch { /* ignore */ }
      }
      continue;
    }

    try {
      await inventoryModule.createInventoryLevels({
        inventory_item_id: item.id,
        location_id: location.id,
        stocked_quantity: 999999,
      });
      created++;
    } catch { /* ignore */ }
  }

  logger.info(`[fix-inventory] ${created} created, ${updated} updated`);
}
