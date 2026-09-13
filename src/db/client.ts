import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connection = postgres(process.env.DATABASE_URL!);

export const db = drizzle(connection);