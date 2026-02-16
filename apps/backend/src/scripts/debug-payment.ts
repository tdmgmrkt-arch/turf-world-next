import { ExecArgs } from "@medusajs/framework/types";

/**
 * Debug payment provider configuration
 * Run: npx medusa exec ./src/scripts/debug-payment.ts
 */
export default async function debugPayment({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any;
  const query = container.resolve("query") as any;

  // 1. Check payment providers
  logger.info("=== Payment Providers ===");
  try {
    const paymentModule = container.resolve("payment") as any;
    const providers = await paymentModule.listPaymentProviders();
    logger.info(`Found ${providers.length} payment providers`);
    for (const p of providers) {
      logger.info(`  - ${p.id} (is_enabled: ${p.is_enabled})`);
    }
  } catch (err: any) {
    logger.error("Payment module error: " + err.message);
    logger.info("The payment module may not be loaded. Check STRIPE_API_KEY env var.");
  }

  // 2. Check regions and their payment providers
  logger.info("\n=== Regions ===");
  try {
    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id", "name", "currency_code", "payment_providers.*"],
    });
    logger.info(`Found ${regions.length} regions`);
    for (const r of regions) {
      logger.info(`  - ${r.name} (${r.id}) currency=${r.currency_code}`);
      if (r.payment_providers?.length) {
        for (const pp of r.payment_providers) {
          logger.info(`    Payment: ${pp.id} (enabled: ${pp.is_enabled})`);
        }
      } else {
        logger.info(`    Payment: NONE - this is likely the problem!`);
      }
    }
  } catch (err: any) {
    logger.error("Region query error: " + err.message);
  }

  // 3. Check carts and their payment collections
  logger.info("\n=== Recent Carts ===");
  try {
    const { data: carts } = await query.graph({
      entity: "cart",
      fields: [
        "id", "region_id", "sales_channel_id", "created_at",
        "payment_collection.id", "payment_collection.status",
        "payment_collection.payment_sessions.*",
      ],
    });
    for (const cart of carts.slice(-5)) {
      logger.info(`  Cart: ${cart.id}`);
      logger.info(`    region=${cart.region_id} sc=${cart.sales_channel_id}`);
      if (cart.payment_collection) {
        logger.info(`    payment_collection=${cart.payment_collection.id} status=${cart.payment_collection.status}`);
        if (cart.payment_collection.payment_sessions?.length) {
          for (const ps of cart.payment_collection.payment_sessions) {
            logger.info(`    session: ${ps.id} provider=${ps.provider_id} status=${ps.status}`);
          }
        }
      } else {
        logger.info(`    payment_collection: NONE`);
      }
    }
  } catch (err: any) {
    logger.error("Cart query error: " + err.message);
  }

  logger.info("\nDone!");
}
