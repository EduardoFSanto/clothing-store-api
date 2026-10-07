import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { errorHandler } from "./middleware/error-handler.js";

import { addressesRoutes } from "./modules/addresses/addresses.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { categoriesRoutes } from "./modules/categories/categories.routes.js";
import { customersRoutes } from "./modules/customers/customers.routes.js";
import { ordersRoutes } from "./modules/orders/orders.routes.js";
import { paymentsRoutes } from "./modules/payments/payments.routes.js";
import { productVariantsRoutes } from "./modules/product-variants/product-variants.routes.js";
import { productsRoutes } from "./modules/products/products.routes.js";
import { productImagesRoutes } from "./modules/product-images/product-images.routes.js";
import { shippingRoutes } from "./modules/shipping/shipping.routes.js";
import { stockRoutes } from "./modules/stock/stock.routes.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ??
      "http://localhost:3000",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  next();
});

app.get("/health", (_req, res) => {
  return res.json({
    status: "ok",
  });
});

app.use("/auth", authRoutes);

app.use("/categories", categoriesRoutes);

app.use("/products", productsRoutes);

app.use("/products", productVariantsRoutes);
app.use("/products", productImagesRoutes);

app.use("/customers", customersRoutes);

app.use("/addresses", addressesRoutes);

app.use("/shipping", shippingRoutes);

app.use("/orders", ordersRoutes);

app.use("/stock", stockRoutes);

app.use("/", paymentsRoutes);

app.use(errorHandler);