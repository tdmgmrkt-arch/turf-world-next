import { ExecArgs } from "@medusajs/framework/types";
import {
  linkProductsToSalesChannelWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Link all products to the Default Sales Channel
 * Run: npx medusa exec ./src/scripts/fix-sales-channel.ts
 */
export default async function fixSalesChannel({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const salesChannelModule = container.resolve("sales_channel") as any;
  const productModule = container.resolve("product") as any;

  // 1. Find default sales channel
  const channels = await salesChannelModule.listSalesChannels({});
  const defaultChannel = channels.find((ch: any) => ch.is_default) || channels[0];
  logger.info(`Default channel: ${defaultChannel.name} (${defaultChannel.id})`);

  // 2. Get all product IDs
  const products = await productModule.listProducts({}, { take: 500, select: ["id", "title"] });
  const productIds = products.map((p: any) => p.id);
  logger.info(`Found ${productIds.length} products to link`);

  // 3. Link all products to the sales channel
  await linkProductsToSalesChannelWorkflow(container).run({
    input: {
      id: defaultChannel.id,
      add: productIds,
    },
  });

  logger.info(`Linked ${productIds.length} products to ${defaultChannel.name}`);
  logger.info("Done!");
}
