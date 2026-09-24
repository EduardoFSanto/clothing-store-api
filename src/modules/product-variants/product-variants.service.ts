import {
  CreateProductVariantInput,
  UpdateProductVariantInput,
} from "./product-variants.schemas.js";

import {
  ProductVariantsRepository,
} from "./product-variants.repository.js";

export class ProductVariantsService {
  constructor(
    private readonly productVariantsRepository: ProductVariantsRepository,
  ) {}

  async findAllByProductId(
    productId: string,
  ) {
    return this.productVariantsRepository
      .findAllByProductId(
        productId,
      );
  }

  async findActiveByProductId(
    productId: string,
  ) {
    return this.productVariantsRepository
      .findActiveByProductId(
        productId,
      );
  }

  async findById(
    id: string,
  ) {
    return this.productVariantsRepository
      .findById(id);
  }

  async create(
    input: CreateProductVariantInput,
  ) {
    const product =
      await this.productVariantsRepository
        .findProductById(
          input.productId,
        );

    if (!product) {
      throw new Error(
        "Product not found",
      );
    }

    if (!product.active) {
      throw new Error(
        "Product is inactive",
      );
    }

    const existingVariant =
      await this.productVariantsRepository
        .findBySku(input.sku);

    if (existingVariant) {
      throw new Error(
        "A product variant with this SKU already exists",
      );
    }

    return this.productVariantsRepository
      .create({
        ...input,
      });
  }

  async update(
    id: string,
    input: UpdateProductVariantInput,
  ) {
    const existingVariant =
      await this.productVariantsRepository
        .findById(id);

    if (!existingVariant) {
      throw new Error(
        "Product variant not found",
      );
    }

    if (input.sku) {
      const variantWithSameSku =
        await this.productVariantsRepository
          .findBySku(input.sku);

      if (
        variantWithSameSku &&
        variantWithSameSku.id !== id
      ) {
        throw new Error(
          "A product variant with this SKU already exists",
        );
      }
    }

    return this.productVariantsRepository
      .update(
        id,
        input,
      );
  }

  async delete(
    id: string,
  ) {
    const existingVariant =
      await this.productVariantsRepository
        .findById(id);

    if (!existingVariant) {
      throw new Error(
        "Product variant not found",
      );
    }

    return this.productVariantsRepository
      .delete(id);
  }
}