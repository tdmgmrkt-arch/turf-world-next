import { ExecArgs } from "@medusajs/framework/types";

export default async function checkChannels({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const query = container.resolve("query") as any;

  // Check sales channels
  const { data: channels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name", "is_default"],
  });
  logger.info("Sales Channels:");
  for (const ch of channels) {
    logger.info(`  - ${ch.name} (${ch.id}) default=${ch.is_default}`);
  }

  // Check API keys and their linked sales channels
  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "type", "token", "created_at"],
  });
  logger.info("API Keys:");
  for (const key of apiKeys) {
    logger.info(`  - ${key.title} (${key.id}) type=${key.type} token=${key.token?.substring(0, 20)}...`);
  }

  // Check publishable key -> sales channel links
  try {
    const linkModule = container.resolve("link") as any;
    const { data: links } = await query.graph({
      entity: "publishable_api_key_sales_channel",
      fields: ["*"],
    });
    logger.info("Publishable Key -> Sales Channel links:");
    for (const link of links) {
      logger.info(`  - ${JSON.stringify(link)}`);
    }
  } catch (err: any) {
    logger.warn("Could not query publishable key links: " + err.message);
  }

  // Check stock location -> sales channel links
  try {
    const { data: locLinks } = await query.graph({
      entity: "stock_location",
      fields: ["id", "name", "sales_channels.*"],
    });
    logger.info("Stock Location -> Sales Channel links:");
    for (const loc of locLinks) {
      logger.info(`  ${loc.name} (${loc.id}):`);
      if (loc.sales_channels?.length) {
        for (const sc of loc.sales_channels) {
          logger.info(`    -> ${sc.name} (${sc.id})`);
        }
      } else {
        logger.info(`    (no linked sales channels)`);
      }
    }
  } catch (err: any) {
    logger.warn("Could not query stock location links: " + err.message);
  }
}
