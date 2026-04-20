import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

const ORDER_ID = "order_01KPEVX33WDK6S9KWNHD5GA870";

export default async function inspectOrder({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "*",
      "items.*",
      "items.detail.*",
      "summary.*",
      "shipping_methods.*",
    ],
    filters: { id: ORDER_ID },
  });

  logger.info(JSON.stringify(orders[0], null, 2));
}
