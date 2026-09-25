export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", {
    length: 150,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  }).notNull().unique(),

  passwordHash: varchar("password_hash", {
    length: 255,
  }).notNull(),

  role: varchar("role", {
    length: 30,
  }).notNull().default("admin"),

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

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  tokenHash: varchar("token_hash", {
    length: 128,
  }).notNull().unique(),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", {
    length: 100,
  }).notNull(),

  slug: varchar("slug", {
    length: 120,
  }).notNull().unique(),

  active: boolean("active")
    .default(true)
    .notNull(),

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

  slug: varchar("slug", { length: 180 })
    .notNull()
    .unique(),

  description: varchar("description", { length: 1000 }),

  imageUrl: varchar("image_url", { length: 1000 }),

  active: boolean("active")
    .default(true)
    .notNull(),

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

  sku: varchar("sku", {
    length: 50,
  }).notNull().unique(),

  size: varchar("size", {
    length: 20,
  }).notNull(),

  color: varchar("color", {
    length: 50,
  }).notNull(),

  priceInCents: integer("price_in_cents")
    .notNull(),

  stock: integer("stock")
    .default(0)
    .notNull(),

  weightInGrams: integer("weight_in_grams")
    .notNull(),

  lengthInCentimeters: integer("length_in_centimeters")
    .notNull(),

  heightInCentimeters: integer("height_in_centimeters")
    .notNull(),

  widthInCentimeters: integer("width_in_centimeters")
    .notNull(),

  active: boolean("active")
    .default(true)
    .notNull(),

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

  name: varchar("name", {
    length: 150,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  }).notNull().unique(),

  phone: varchar("phone", {
    length: 30,
  }),

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

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),

  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, {
      onDelete: "cascade",
    }),

  cep: varchar("cep", {
    length: 9,
  }).notNull(),

  street: varchar("street", {
    length: 200,
  }).notNull(),

  number: varchar("number", {
    length: 20,
  }).notNull(),

  complement: varchar("complement", {
    length: 100,
  }),

  neighborhood: varchar("neighborhood", {
    length: 100,
  }).notNull(),

  city: varchar("city", {
    length: 100,
  }).notNull(),

  state: varchar("state", {
    length: 2,
  }).notNull(),

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

  status: varchar("status", {
    length: 30,
  })
    .notNull()
    .default("pending"),

  subtotalInCents: integer("subtotal_in_cents")
    .notNull(),

  shippingInCents: integer("shipping_in_cents")
    .notNull()
    .default(0),

  totalInCents: integer("total_in_cents")
    .notNull(),

  shippingCep: varchar("shipping_cep", {
    length: 9,
  }).notNull(),

  shippingStreet: varchar("shipping_street", {
    length: 200,
  }).notNull(),

  shippingNumber: varchar("shipping_number", {
    length: 20,
  }).notNull(),

  shippingComplement: varchar("shipping_complement", {
    length: 100,
  }),

  shippingNeighborhood: varchar("shipping_neighborhood", {
    length: 100,
  }).notNull(),

  shippingCity: varchar("shipping_city", {
    length: 100,
  }).notNull(),

  shippingState: varchar("shipping_state", {
    length: 2,
  }).notNull(),

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

  unitPriceInCents: integer("unit_price_in_cents")
    .notNull(),

  quantity: integer("quantity")
    .notNull(),

  totalInCents: integer("total_in_cents")
    .notNull(),

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

  amountInCents: integer("amount_in_cents")
    .notNull(),

  provider: varchar("provider", {
    length: 50,
  }),

  providerPaymentId: varchar("provider_payment_id", {
    length: 150,
  }),

  checkoutUrl: varchar("checkout_url", {
    length: 500,
  }),

  invoiceSlug: varchar("invoice_slug", {
    length: 150,
  }),

  transactionNsu: varchar("transaction_nsu", {
    length: 150,
  }).unique(),

  receiptUrl: varchar("receipt_url", {
    length: 500,
  }),

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

export const stockMovements = pgTable("stock_movements", {
  id: uuid("id").defaultRandom().primaryKey(),

  productVariantId: uuid("product_variant_id")
    .notNull()
    .references(() => productVariants.id),

  type: varchar("type", {
    length: 30,
  }).notNull(),

  quantity: integer("quantity")
    .notNull(),

  reason: varchar("reason", {
    length: 255,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
