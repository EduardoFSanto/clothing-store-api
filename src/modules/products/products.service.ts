import type { CreateProductInput } from "./products.schemas.js";
import { ProductsRepository } from "./products.repository.js";

export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
  ) {}

  async findAll() {
    return this.productsRepository.findAll();
  }

  async findById(id: string) {
    return this.productsRepository.findById(id);
  }

  async create(input: CreateProductInput) {
    const existingProduct =
      await this.productsRepository.findBySlug(input.slug);

    if (existingProduct) {
      throw new Error(
        "A product with this slug already exists",
      );
    }

    return this.productsRepository.create({
      categoryId: input.categoryId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      active: input.active ?? true,
    });
  }
}