import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "./customers.schemas.js";

import { CustomersRepository } from "./customers.repository.js";

export class CustomersService {
  constructor(
    private readonly customersRepository: CustomersRepository,
  ) {}

  async findAll() {
    return this.customersRepository.findAll();
  }

  async findById(id: string) {
    return this.customersRepository.findById(id);
  }

  async create(input: CreateCustomerInput) {
    const normalizedEmail =
      input.email.toLowerCase();

    const existingCustomer =
      await this.customersRepository.findByEmail(
        normalizedEmail,
      );

    if (existingCustomer) {
      throw new Error(
        "A customer with this email already exists",
      );
    }

    return this.customersRepository.create({
      name: input.name,
      email: normalizedEmail,
      phone: input.phone,
    });
  }

  async update(
    id: string,
    input: UpdateCustomerInput,
  ) {
    const existingCustomer =
      await this.customersRepository.findById(id);

    if (!existingCustomer) {
      return null;
    }

    if (
      input.email &&
      input.email.toLowerCase() !==
        existingCustomer.email
    ) {
      const customerWithSameEmail =
        await this.customersRepository.findByEmail(
          input.email.toLowerCase(),
        );

      if (customerWithSameEmail) {
        throw new Error(
          "A customer with this email already exists",
        );
      }
    }

    return this.customersRepository.update(
      id,
      {
        ...input,
        email: input.email?.toLowerCase(),
      },
    );
  }
}