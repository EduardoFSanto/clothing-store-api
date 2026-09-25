import { eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { users } from "../../db/schema/index.js";
import { hashPassword } from "./password.js";

export async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName =
    process.env.ADMIN_NAME ?? "Administrador";

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required",
    );
  }

  const normalizedEmail =
    adminEmail.trim().toLowerCase();

  const [existingUser] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existingUser) {
    return;
  }

  const passwordHash =
    await hashPassword(adminPassword);

  await db.insert(users).values({
    name: adminName,
    email: normalizedEmail,
    passwordHash,
    role: "admin",
  });

  console.log(
    `Admin user created: ${normalizedEmail}`,
  );
}