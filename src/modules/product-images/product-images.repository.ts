import { asc, eq, sql } from "drizzle-orm";
import { db } from "../../db/client.js";
import { productImages } from "../../db/schema/index.js";

export class ProductImagesRepository {
  async findByProductId(productId: string) {
    return db.select().from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(asc(productImages.position), asc(productImages.createdAt));
  }
  async create(productId: string, imageUrl: string, position: number) {
    const [image] = await db.insert(productImages).values({ productId, imageUrl, position }).returning();
    return image;
  }
  async remove(id: string) {
    const [image] = await db.delete(productImages).where(eq(productImages.id, id)).returning();
    return image ?? null;
  }
  async nextPosition(productId: string) {
    const [result] = await db.select({ max: sql`coalesce(max(${productImages.position}), -1)` })
      .from(productImages).where(eq(productImages.productId, productId));
    return Number(result?.max ?? -1) + 1;
  }
}