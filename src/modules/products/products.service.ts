import type {
  CreateProductInput,
  UpdateProductInput,
} from "./products.schemas.js";
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

  async update(id: string, input: UpdateProductInput) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      return null;
    }

    if (input.slug && input.slug !== product.slug) {
      const existingProduct = await this.productsRepository.findBySlug(input.slug);

      if (existingProduct && existingProduct.id !== id) {
        throw new Error("A product with this slug already exists");
      }
    }

    return this.productsRepository.update(id, input);
  }

  async deactivate(id: string) {
    return this.productsRepository.update(id, { active: false });
  }

  async create(input: CreateProductInput) {
    const existingProduct =
      await this.productsRepository.findBySlug(
        input.slug,
      );

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
      imageUrl: input.imageUrl,
      active: input.active ?? true,
    });
  }
}