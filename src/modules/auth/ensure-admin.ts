import { eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { users } from "../../db/schema/index.js";
import { hashPassword, verifyPassword } from "./password.js";
import { AuthRepository } from "./auth.repository.js";

const authRepository = new AuthRepository();

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
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existingUser) {
    const passwordMatches = await verifyPassword(
      adminPassword,
      existingUser.passwordHash,
    );

    if (!passwordMatches) {
      const passwordHash = await hashPassword(adminPassword);

      await db
        .update(users)
        .set({
          passwordHash,
          name: adminName,
        })
        .where(eq(users.id, existingUser.id));

      await authRepository.deleteSessionsByUserId(
        existingUser.id,
      );

      console.log(`Admin password synchronized: ${normalizedEmail}`);
    }

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