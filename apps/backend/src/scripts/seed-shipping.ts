import { ExecArgs } from "@medusajs/framework/types";
import {
  createLocationFulfillmentSetWorkflow,
  createServiceZonesWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  createShippingOptionsWorkflow,
  deleteShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Seed Shipping for Turf World
 *
 * Creates stock location, fulfillment set, service zone, and shipping option.
 * Run: npx medusa exec ./src/scripts/seed-shipping.ts
 */
export default async function seedShipping({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const fulfillmentModule = container.resolve("fulfillment") as any;
  const stockLocationModule = container.resolve("stock_location") as any;
  const salesChannelModule = container.resolve("sales_channel") as any;

  logger.info("Seeding shipping...");

  // 1. Find or create stock location
  let stockLocations = await stockLocationModule.listStockLocations({});
  logger.info(`Found ${stockLocations.length} stock locations`);

  let location: any;
  if (stockLocations.length === 0) {
    logger.info("Creating stock location...");
    const { result: locations } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Main Warehouse",
            address: {
              address_1: "123 Main St",
              city: "Los Angeles",
              country_code: "US",
              province: "CA",
              postal_code: "90001",
            },
          },
        ],
      },
    });
    location = locations[0];
    logger.info(`Created stock location: ${location.name} (${location.id})`);

    // Link to default sales channel
    const salesChannels = await salesChannelModule.listSalesChannels({});
    logger.info(`Found ${salesChannels.length} sales channels`);
    if (salesChannels.length > 0) {
      const defaultChannel = salesChannels.find((sc: any) => sc.is_default) || salesChannels[0];
      logger.info(`Linking to sales channel: ${defaultChannel.name} (${defaultChannel.id})`);
      await linkSalesChannelsToStockLocationWorkflow(container).run({
        input: {
          id: location.id,
          add: [defaultChannel.id],
        },
      });
      logger.info("Linked stock location to sales channel");
    }
  } else {
    location = stockLocations[0];
    logger.info(`Using existing stock location: ${location.name} (${location.id})`);
  }

  // 2. Find shipping profile
  const profiles = await fulfillmentModule.listShippingProfiles();
  logger.info(`Found ${profiles.length} shipping profiles`);
  const shippingProfile = profiles.find((p: any) => p.type === "default") || profiles[0];
  if (!shippingProfile) {
    logger.error("No shipping profile found!");
    return;
  }
  logger.info(`Using shipping profile: ${shippingProfile.name} (${shippingProfile.id})`);

  // 3. Find or create fulfillment set
  const existingSets = await fulfillmentModule.listFulfillmentSets(
    {},
    { relations: ["service_zones", "service_zones.geo_zones"] }
  );
  logger.info(`Found ${existingSets.length} existing fulfillment sets`);

  let fulfillmentSetId: string;
  let serviceZoneId: string | null = null;

  if (existingSets.length > 0) {
    const shippingSet = existingSets.find((fs: any) => fs.type === "shipping") || existingSets[0];
    fulfillmentSetId = shippingSet.id;
    logger.info(`Using existing fulfillment set: ${shippingSet.name} (${shippingSet.id})`);

    if (shippingSet.service_zones?.length > 0) {
      serviceZoneId = shippingSet.service_zones[0].id;
      logger.info(`Using existing service zone: ${shippingSet.service_zones[0].name} (${serviceZoneId})`);
    }
  } else {
    logger.info("Creating fulfillment set...");
    const workflowResult = await createLocationFulfillmentSetWorkflow(container).run({
      input: {
        location_id: location.id,
        fulfillment_set_data: {
          name: "Shipping",
          type: "shipping",
        },
      },
    });
    logger.info("Workflow result: " + JSON.stringify(workflowResult.result, null, 2));

    // The result may be the fulfillment set directly or nested
    const fulfillmentSet = (workflowResult.result as any);
    if (fulfillmentSet?.id) {
      fulfillmentSetId = fulfillmentSet.id;
      logger.info(`Created fulfillment set: ${fulfillmentSet.name} (${fulfillmentSetId})`);
    } else {
      // Re-list to find the newly created set
      const newSets = await fulfillmentModule.listFulfillmentSets({});
      if (newSets.length > 0) {
        fulfillmentSetId = newSets[0].id;
        logger.info(`Found fulfillment set after creation: ${newSets[0].name} (${fulfillmentSetId})`);
      } else {
        logger.error("Failed to create or find fulfillment set");
        return;
      }
    }
  }

  // 4. Create service zone if needed
  if (!serviceZoneId) {
    logger.info("Creating service zone...");
    const { result: serviceZones } = await createServiceZonesWorkflow(container).run({
      input: {
        data: [
          {
            name: "United States",
            fulfillment_set_id: fulfillmentSetId,
            geo_zones: [
              {
                type: "country" as const,
                country_code: "us",
              },
            ],
          },
        ],
      },
    });
    serviceZoneId = (serviceZones as any)[0].id;
    logger.info(`Created service zone: ${(serviceZones as any)[0].name} (${serviceZoneId})`);
  }

  // 5. Log existing shipping options (per-profile cleanup happens in step 7)
  const existingOptions = await fulfillmentModule.listShippingOptions(
    { service_zone_id: serviceZoneId },
  );
  logger.info(`Found ${existingOptions.length} existing shipping options in service zone`);

  // 6. Find fulfillment provider
  let providerId = "manual_manual";
  try {
    const providers = await fulfillmentModule.listFulfillmentProviders();
    logger.info(`Found ${providers.length} fulfillment providers`);
    for (const p of providers) {
      logger.info(`  - ${p.id}`);
    }
    if (providers.length > 0) {
      const manual = providers.find((p: any) => p.id.includes("manual"));
      if (manual) providerId = manual.id;
    }
  } catch (err: any) {
    logger.warn("Could not list providers, using default: " + providerId);
  }

  // 7. Create shipping options WITH prices for ALL shipping profiles.
  // Products may be assigned to different profiles, and each profile needs
  // a shipping option or cart completion fails with "shipping profiles not satisfied".
  logger.info(`Creating shipping options with provider: ${providerId}...`);
  for (const profile of profiles) {
    // Check if this profile already has a priced option in the current service zone
    const existingForProfile = await fulfillmentModule.listShippingOptions({
      service_zone_id: serviceZoneId,
      shipping_profile_id: profile.id,
    });

    if (existingForProfile.length > 0) {
      // Verify at least one has prices
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

      if (hasPrices) {
        logger.info(`Profile "${profile.name}" (${profile.id}) already has priced shipping options — skipping`);
        continue;
      }

      // Delete priceless options for this profile
      try {
        await deleteShippingOptionsWorkflow(container).run({
          input: { ids: existingForProfile.map((o: any) => o.id) },
        });
      } catch { /* ignore */ }
    }

    try {
      const { result } = await createShippingOptionsWorkflow(container).run({
        input: [
          {
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
            prices: [
              {
                currency_code: "usd",
                amount: 0, // $0 — actual shipping cost is calculated in the storefront
              },
            ],
            rules: [],
          },
        ],
      });

      for (const opt of result as any[]) {
        logger.info(`  Created: ${opt.name} (${opt.id}) for profile "${profile.name}"`);
      }
    } catch (err: any) {
      logger.error(`Failed to create shipping option for profile "${profile.name}": ${err.message}`);
    }
  }

  logger.info("Done!");
}
