import { createHash } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";

import { db } from "../../db/client.js";
import {
  sessions,
  users,
} from "../../db/schema/index.js";

function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export class AuthRepository {
  async findUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ?? null;
  }

  async createSession(
    userId: string,
    token: string,
    expiresAt: Date,
  ) {
    const [session] = await db
      .insert(sessions)
      .values({
        userId,
        tokenHash: hashToken(token),
        expiresAt,
      })
      .returning();

    return session;
  }

  async findUserBySessionToken(
    token: string,
  ) {
    const tokenHash = hashToken(token);

    const [result] = await db
      .select({
        user: users,
        session: sessions,
      })
      .from(sessions)
      .innerJoin(
        users,
        eq(sessions.userId, users.id),
      )
      .where(
        and(
          eq(sessions.tokenHash, tokenHash),
          gt(sessions.expiresAt, new Date()),
        ),
      )
      .limit(1);

    return result ?? null;
  }

  async deleteSession(token: string) {
    await db
      .delete(sessions)
      .where(
        eq(
          sessions.tokenHash,
          hashToken(token),
        ),
      );
  }
}

