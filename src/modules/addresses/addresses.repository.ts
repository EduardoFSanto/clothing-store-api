import { and, eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import {
  addresses,
  customers,
} from "../../db/schema/index.js";

import type { NewAddress } from "./addresses.types.js";

export class AddressesRepository {
  async findAllByCustomerId(
    customerId: string,
  ) {
    return db
      .select()
      .from(addresses)
      .where(
        eq(
          addresses.customerId,
          customerId,
        ),
      );
  }

  async findById(id: string) {
    const [address] =
      await db
        .select()
        .from(addresses)
        .where(eq(addresses.id, id))
        .limit(1);

    return address ?? null;
  }

  async findByIdAndCustomerId(
    id: string,
    customerId: string,
  ) {
    const [address] =
      await db
        .select()
        .from(addresses)
        .where(
          and(
            eq(addresses.id, id),
            eq(
              addresses.customerId,
              customerId,
            ),
          ),
        )
        .limit(1);

    return address ?? null;
  }

  async findCustomerById(
    customerId: string,
  ) {
    const [customer] =
      await db
        .select({
          id: customers.id,
        })
        .from(customers)
        .where(
          eq(customers.id, customerId),
        )
        .limit(1);

    return customer ?? null;
  }

  async create(data: NewAddress) {
    const [address] =
      await db
        .insert(addresses)
        .values(data)
        .returning();

    return address;
  }

  async update(
    id: string,
    customerId: string,
    data: Partial<NewAddress>,
  ) {
    const [address] =
      await db
        .update(addresses)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(addresses.id, id),
            eq(
              addresses.customerId,
              customerId,
            ),
          ),
        )
        .returning();

    return address ?? null;
  }

  async delete(
    id: string,
    customerId: string,
  ) {
    const [address] =
      await db
        .delete(addresses)
        .where(
          and(
            eq(addresses.id, id),
            eq(
              addresses.customerId,
              customerId,
            ),
          ),
        )
        .returning();

    return address ?? null;
  }
}