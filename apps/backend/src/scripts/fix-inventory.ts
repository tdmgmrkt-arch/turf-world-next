import { ExecArgs } from "@medusajs/framework/types";
import {
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Fix Inventory & Stock Location Associations
 *
 * - Links ALL sales channels to the stock location
 * - Creates inventory levels for all inventory items at the stock location
 *
 * Run: npx medusa exec ./src/scripts/fix-inventory.ts
 */
export default async function fixInventory({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const stockLocationModule = container.resolve("stock_location") as any;
  const salesChannelModule = container.resolve("sales_channel") as any;
  const inventoryModule = container.resolve("inventory") as any;

  logger.info("Fixing inventory associations...");

  // 1. Find stock location
  const stockLocations = await stockLocationModule.listStockLocations({});
  if (stockLocations.length === 0) {
    logger.error("No stock locations found! Run seed-shipping.ts first.");
    return;
  }
  const location = stockLocations[0];
  logger.info(`Stock location: ${location.name} (${location.id})`);

  // 2. Link ALL sales channels to stock location
  const salesChannels = await salesChannelModule.listSalesChannels({});
  logger.info(`Found ${salesChannels.length} sales channels`);

  const channelIds = salesChannels.map((sc: any) => sc.id);
  for (const sc of salesChannels) {
    logger.info(`  - ${sc.name} (${sc.id}) default=${sc.is_default}`);
  }

  if (channelIds.length > 0) {
    try {
      await linkSalesChannelsToStockLocationWorkflow(container).run({
        input: {
          id: location.id,
          add: channelIds,
        },
      });
      logger.info(`Linked ${channelIds.length} sales channels to stock location`);
    } catch (err: any) {
      // May already be linked
      logger.warn("Link workflow error (may already be linked): " + err.message);
    }
  }

  // 3. Find all inventory items
  const inventoryItems = await inventoryModule.listInventoryItems(
    {},
    { relations: ["location_levels"], take: 500 }
  );
  logger.info(`Found ${inventoryItems.length} inventory items`);

  // 4. Create or update inventory levels at stock location
  let created = 0;
  let updated = 0;
  for (const item of inventoryItems) {
    const existingLevel = item.location_levels?.find(
      (ll: any) => ll.location_id === location.id
    );

    if (existingLevel) {
      // Update existing levels to high stock so large sq-ft orders aren't blocked
      if (existingLevel.stocked_quantity < 999999) {
        try {
          await inventoryModule.updateInventoryLevels(existingLevel.id, {
            stocked_quantity: 999999,
          });
          updated++;
        } catch (err: any) {
          logger.warn(`  Failed to update ${item.sku || item.id}: ${err.message}`);
        }
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
    } catch (err: any) {
      logger.warn(`  Failed for ${item.sku || item.id}: ${err.message}`);
    }
  }

  logger.info(`Inventory levels: ${created} created, ${updated} updated to 999999`);
  logger.info("Done!");
}
