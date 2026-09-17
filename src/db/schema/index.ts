import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),

  slug: varchar("slug", { length: 120 }).notNull().unique(),

  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),

  name: varchar("name", { length: 150 }).notNull(),

  slug: varchar("slug", { length: 180 }).notNull().unique(),

  description: varchar("description", {
    length: 1000,
  }),

  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
    }),

  sku: varchar("sku", { length: 50 }).notNull().unique(),

  size: varchar("size", { length: 20 }).notNull(),

  color: varchar("color", { length: 50 }).notNull(),

  priceInCents: integer("price_in_cents").notNull(),

  stock: integer("stock").default(0).notNull(),

  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 150 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  phone: varchar("phone", { length: 30 }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),

  status: varchar("status", { length: 30 })
    .notNull()
    .default("pending"),

  subtotalInCents: integer("subtotal_in_cents").notNull(),

  shippingInCents: integer("shipping_in_cents")
    .notNull()
    .default(0),

  totalInCents: integer("total_in_cents").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),

  productVariantId: uuid("product_variant_id")
    .notNull()
    .references(() => productVariants.id),

  productName: varchar("product_name", {
    length: 150,
  }).notNull(),

  sku: varchar("sku", {
    length: 50,
  }).notNull(),

  size: varchar("size", {
    length: 20,
  }).notNull(),

  color: varchar("color", {
    length: 50,
  }).notNull(),

  unitPriceInCents: integer(
    "unit_price_in_cents",
  ).notNull(),

  quantity: integer("quantity").notNull(),

  totalInCents: integer(
    "total_in_cents",
  ).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});  

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),

  status: varchar("status", {
    length: 30,
  })
    .notNull()
    .default("pending"),

  method: varchar("method", {
    length: 30,
  }).notNull(),

  amountInCents: integer(
    "amount_in_cents",
  ).notNull(),

  provider: varchar("provider", {
    length: 50,
  }),

  providerPaymentId: varchar(
    "provider_payment_id",
    {
      length: 150,
    },
  ),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const stockMovements = pgTable(
  "stock_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productVariantId: uuid(
      "product_variant_id",
    )
      .notNull()
      .references(() => productVariants.id),

    type: varchar("type", {
      length: 30,
    }).notNull(),

    quantity: integer("quantity").notNull(),

    reason: varchar("reason", {
      length: 255,
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
);