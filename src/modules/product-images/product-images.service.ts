import { ProductImagesRepository } from "./product-images.repository.js";

export class ProductImagesService {
  constructor(private readonly repository: ProductImagesRepository) {}
  async list(productId: string) { return this.repository.findByProductId(productId); }
  async add(productId: string, imageUrl: string, position?: number) {
    return this.repository.create(productId, imageUrl, position ?? await this.repository.nextPosition(productId));
  }
  async remove(id: string) { return this.repository.remove(id); }
}