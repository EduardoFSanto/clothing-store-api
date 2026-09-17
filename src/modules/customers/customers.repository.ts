import { eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { customers } from "../../db/schema/index.js";

import type { NewCustomer } from "./customers.types.js";

export class CustomersRepository {
  async findAll() {
    return db
      .select()
      .from(customers);
  }

  async findById(id: string) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);

    return customer ?? null;
  }

  async findByEmail(email: string) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);

    return customer ?? null;
  }

  async create(data: NewCustomer) {
    const [customer] = await db
      .insert(customers)
      .values(data)
      .returning();

    return customer;
  }

  async update(
    id: string,
    data: Partial<NewCustomer>,
  ) {
    const [customer] = await db
      .update(customers)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning();

    return customer ?? null;
  }
}