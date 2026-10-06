import "dotenv/config";

import { OrdersRepository } from "../modules/orders/orders.repository.js";
import { OrdersService } from "../modules/orders/orders.service.js";

const ordersRepository = new OrdersRepository();
const ordersService = new OrdersService(ordersRepository);

async function run() {
  const expiredCount =
    await ordersService.expirePendingOrders();

  console.log(
    `Expired ${expiredCount} pending order(s).`,
  );
}

run().catch((error) => {
  console.error(
    "Failed to expire pending orders:",
    error,
  );
  process.exit(1);
});
