import type {
  CreateStockMovementInput,
} from "./stock.schemas.js";

import {
  StockRepository,
} from "./stock.repository.js";

export class StockService {
  constructor(
    private readonly stockRepository: StockRepository,
  ) {}

  async findMovementsByVariantId(
    productVariantId: string,
  ) {
    const variant =
      await this.stockRepository.findVariantById(
        productVariantId,
      );

    if (!variant) {
      throw new Error(
        "Product variant not found",
      );
    }

    return this.stockRepository.findMovementsByVariantId(
      productVariantId,
    );
  }

  async createMovement(
    productVariantId: string,
    input: CreateStockMovementInput,
  ) {
    const variant =
      await this.stockRepository.findVariantById(
        productVariantId,
      );

    if (!variant) {
      throw new Error(
        "Product variant not found",
      );
    }

    if (!variant.active) {
      throw new Error(
        `Product variant ${variant.sku} is inactive`,
      );
    }

    if (!variant.productActive) {
      throw new Error(
        `Product ${variant.productName} is inactive`,
      );
    }

    return this.stockRepository.createMovement({
      productVariantId,
      type: input.type,
      quantity: input.quantity,
      reason: input.reason,
    });
  }
}