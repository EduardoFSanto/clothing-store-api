import type { Request, Response } from "express";
import { ProductImagesRepository } from "./product-images.repository.js";
import { createProductImageSchema } from "./product-images.schemas.js";
import { ProductImagesService } from "./product-images.service.js";

const service = new ProductImagesService(new ProductImagesRepository());

export async function listProductImagesController(req: Request, res: Response) {
  const { id } = req.params;
  if (typeof id !== "string") return res.status(400).json({ error: { message: "Invalid product id" } });
  return res.json({ data: await service.list(id) });
}
export async function createProductImageController(req: Request, res: Response) {
  const { id } = req.params;
  if (typeof id !== "string") return res.status(400).json({ error: { message: "Invalid product id" } });
  const input = createProductImageSchema.parse(req.body);
  return res.status(201).json({ data: await service.add(id, input.imageUrl, input.position) });
}
export async function deleteProductImageController(req: Request, res: Response) {
  const { imageId } = req.params;
  if (typeof imageId !== "string") return res.status(400).json({ error: { message: "Invalid image id" } });
  const image = await service.remove(imageId);
  if (!image) return res.status(404).json({ error: { message: "Image not found" } });
  return res.json({ data: image });
}