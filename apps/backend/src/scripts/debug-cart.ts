import { ExecArgs } from "@medusajs/framework/types";
import {
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Debug cart/sales channel issues and fix stock location links
 */
export default async function debugCart({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const query = container.resolve("query") as any;
  const stockLocationModule = container.resolve("stock_location") as any;

  // 1. Try to find the mystery sales channel directly
  const mysterySC = "sc_01KH7M5MW619SKNZ30WDQNS9TX";
  logger.info(`Looking for sales channel: ${mysterySC}`);

  try {
    const { data: channels } = await query.graph({
      entity: "sales_channel",
      fields: ["id", "name", "is_default", "is_disabled", "created_at", "deleted_at"],
      filters: { id: mysterySC },
    });
    logger.info(`Query result: ${JSON.stringify(channels)}`);
  } catch (err: any) {
    logger.warn("Direct query failed: " + err.message);
  }

  // 2. List ALL sales channels without any filtering
  try {
    const salesChannelModule = container.resolve("sales_channel") as any;
    const allChannels = await salesChannelModule.listSalesChannels({}, { take: 100 });
    logger.info(`All sales channels (module): ${allChannels.length}`);
    for (const ch of allChannels) {
      logger.info(`  - ${ch.name} (${ch.id}) disabled=${ch.is_disabled}`);
    }
  } catch (err: any) {
    logger.warn("listSalesChannels failed: " + err.message);
  }

  // 3. Check recent carts to see what sales channel they're using
  try {
    const { data: carts } = await query.graph({
      entity: "cart",
      fields: ["id", "sales_channel_id", "created_at", "region_id"],
      filters: {},
    });
    logger.info(`Found ${carts.length} carts`);
    for (const cart of carts.slice(-10)) {
      logger.info(`  - ${cart.id} sc=${cart.sales_channel_id} region=${cart.region_id} created=${cart.created_at}`);
    }
  } catch (err: any) {
    logger.warn("Cart query failed: " + err.message);
  }

  // 4. Check all publishable API keys and their sales channel links
  try {
    const { data: keys } = await query.graph({
      entity: "api_key",
      fields: ["id", "title", "type", "token", "revoked_at"],
      filters: {},
    });
    logger.info(`All API keys: ${keys.length}`);
    for (const key of keys) {
      logger.info(`  - ${key.title} (${key.id}) type=${key.type} token=${key.token?.substring(0, 30)}... revoked=${key.revoked_at}`);
    }
  } catch (err: any) {
    logger.warn("API key query failed: " + err.message);
  }

  // 5. Try to link the mystery sales channel to stock location (if it exists)
  const stockLocations = await stockLocationModule.listStockLocations({});
  if (stockLocations.length > 0) {
    const location = stockLocations[0];
    logger.info(`Attempting to link ${mysterySC} to ${location.name}...`);
    try {
      await linkSalesChannelsToStockLocationWorkflow(container).run({
        input: {
          id: location.id,
          add: [mysterySC],
        },
      });
      logger.info("Successfully linked mystery sales channel to stock location!");
    } catch (err: any) {
      logger.error("Failed to link: " + err.message);
    }
  }

  logger.info("Done!");
}
