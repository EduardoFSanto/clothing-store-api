import type {
  CreateAddressInput,
  UpdateAddressInput,
} from "./addresses.schemas.js";

import {
  AddressesRepository,
} from "./addresses.repository.js";

export class AddressesService {
  constructor(
    private readonly addressesRepository: AddressesRepository,
  ) {}

  async findAllByCustomerId(
    customerId: string,
  ) {
    return this.addressesRepository.findAllByCustomerId(
      customerId,
    );
  }

  async findById(id: string) {
    return this.addressesRepository.findById(
      id,
    );
  }

  async create(
    input: CreateAddressInput,
  ) {
    const customer =
      await this.addressesRepository.findCustomerById(
        input.customerId,
      );

    if (!customer) {
      throw new Error(
        "Customer not found",
      );
    }

    const normalizedCep =
      input.cep.replace(/\D/g, "");

    return this.addressesRepository.create({
      customerId: input.customerId,
      cep: normalizedCep,
      street: input.street,
      number: input.number,
      complement:
        input.complement || null,
      neighborhood:
        input.neighborhood,
      city: input.city,
      state: input.state,
    });
  }

  async update(
    id: string,
    input: UpdateAddressInput,
  ) {
    const address =
      await this.addressesRepository.findById(
        id,
      );

    if (!address) {
      return null;
    }

    const data: Partial<
      CreateAddressInput
    > = {
      ...input,
    };

    if (input.cep) {
      data.cep =
        input.cep.replace(/\D/g, "");
    }

    if (input.complement !== undefined) {
      data.complement =
        input.complement || undefined;
    }

    return this.addressesRepository.update(
      id,
      address.customerId,
      data,
    );
  }

  async delete(id: string) {
    const address =
      await this.addressesRepository.findById(
        id,
      );

    if (!address) {
      return null;
    }

    return this.addressesRepository.delete(
      id,
      address.customerId,
    );
  }
}