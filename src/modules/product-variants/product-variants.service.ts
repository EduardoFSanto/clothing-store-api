import type {
  CreateProductVariantInput,
  UpdateProductVariantInput,
} from "./product-variants.schemas.js";

import { ProductVariantsRepository } from "./product-variants.repository.js";

export class ProductVariantsService {
  constructor(
    private readonly productVariantsRepository: ProductVariantsRepository,
  ) {}

  async findByProductId(productId: string) {
    const product =
      await this.productVariantsRepository.findProductById(
        productId,
      );

    if (!product) {
      throw new Error("Product not found");
    }

    return this.productVariantsRepository.findByProductId(
      productId,
    );
  }

  async findById(id: string) {
    return this.productVariantsRepository.findById(id);
  }

  async create(
    productId: string,
    input: CreateProductVariantInput,
  ) {
    const product =
      await this.productVariantsRepository.findProductById(
        productId,
      );

    if (!product) {
      throw new Error("Product not found");
    }

    const existingVariant =
      await this.productVariantsRepository.findBySku(
        input.sku,
      );

    if (existingVariant) {
      throw new Error(
        "A product variant with this SKU already exists",
      );
    }

    return this.productVariantsRepository.create({
      productId,
      sku: input.sku,
      size: input.size,
      color: input.color,
      priceInCents: input.priceInCents,
      stock: input.stock,
      active: input.active ?? true,
    });
  }

  async update(
    id: string,
    input: UpdateProductVariantInput,
  ) {
    const existingVariant =
      await this.productVariantsRepository.findById(id);

    if (!existingVariant) {
      return null;
    }

    if (
      input.sku &&
      input.sku !== existingVariant.sku
    ) {
      const variantWithSameSku =
        await this.productVariantsRepository.findBySku(
          input.sku,
        );

      if (variantWithSameSku) {
        throw new Error(
          "A product variant with this SKU already exists",
        );
      }
    }

    return this.productVariantsRepository.update(
      id,
      input,
    );
  }

  async delete(id: string) {
    const existingVariant =
      await this.productVariantsRepository.findById(id);

    if (!existingVariant) {
      return null;
    }

    return this.productVariantsRepository.delete(id);
  }
}