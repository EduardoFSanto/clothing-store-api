import express from "express";

import { errorHandler } from "./middleware/error-handler.js";

import { categoriesRoutes } from "./modules/categories/categories.routes.js";

import { customersRoutes } from "./modules/customers/customers.routes.js";

import { ordersRoutes } from "./modules/orders/orders.routes.js";

import { paymentsRoutes } from "./modules/payments/payments.routes.js";

import { productVariantsRoutes } from "./modules/product-variants/product-variants.routes.js";

import { productsRoutes } from "./modules/products/products.routes.js";

import { stockRoutes } from "./modules/stock/stock.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  return res.json({
    status: "ok",
  });
});

app.use(
  "/categories",
  categoriesRoutes,
);

app.use(
  "/products",
  productsRoutes,
);

app.use(
  "/products",
  productVariantsRoutes,
);

app.use(
  "/customers",
  customersRoutes,
);

app.use(
  "/orders",
  ordersRoutes,
);

app.use(
  "/stock",
  stockRoutes,
);

app.use(
  "/",
  paymentsRoutes,
);

app.use(errorHandler);