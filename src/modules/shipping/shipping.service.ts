import { TableShippingClient } from "./providers/table/table.client.js";
import { ViaCepClient } from "./providers/viacep/viacep.client.js";

import { ShippingRepository } from "./shipping.repository.js";

import type {
  ShippingAddress,
  ShippingQuoteResult,
} from "./shipping.types.js";

export class ShippingService {
  constructor(
    private readonly viaCepClient: ViaCepClient,
    private readonly tableShippingClient: TableShippingClient,
    private readonly shippingRepository: ShippingRepository,
  ) {}

  async findAddressByCep(
    cep: string,
  ): Promise<ShippingAddress | null> {
    const data =
      await this.viaCepClient.findByCep(cep);

    if (!data) {
      return null;
    }

    if (
      !data.logradouro ||
      !data.bairro ||
      !data.localidade ||
      !data.uf
    ) {
      throw new Error(
        "CEP provider returned incomplete address data",
      );
    }

    return {
      cep: data.cep
        ? data.cep.replace(/\D/g, "")
        : cep.replace(/\D/g, ""),

      street: data.logradouro,

      neighborhood: data.bairro,

      city: data.localidade,

      state: data.uf,
    };
  }

  async calculateQuote(input: {
    destinationCep: string;

    items: {
      productVariantId: string;
      quantity: number;
    }[];
  }): Promise<ShippingQuoteResult> {
    const variantIds =
      input.items.map(
        (item) =>
          item.productVariantId,
      );

    const variants =
      await this.shippingRepository
        .findVariantsByIds(
          variantIds,
        );

    if (
      variants.length !==
      variantIds.length
    ) {
      throw new Error(
        "One or more product variants were not found",
      );
    }

    for (const item of input.items) {
      const variant =
        variants.find(
          (current) =>
            current.id ===
            item.productVariantId,
        );

      if (!variant) {
        throw new Error(
          `Product variant ${item.productVariantId} not found`,
        );
      }

      if (!variant.active) {
        throw new Error(
          `Product variant ${variant.id} is inactive`,
        );
      }

      if (!variant.productActive) {
        throw new Error(
          `Product ${variant.productName} is inactive`,
        );
      }

      if (item.quantity <= 0) {
        throw new Error(
          `Invalid quantity for product variant ${variant.id}`,
        );
      }
    }

    const destinationAddress =
      await this.findAddressByCep(
        input.destinationCep,
      );

    if (!destinationAddress) {
      throw new Error(
        "Destination CEP not found",
      );
    }

    return this.tableShippingClient.calculateQuote(
      destinationAddress.state,
    );
  }
}