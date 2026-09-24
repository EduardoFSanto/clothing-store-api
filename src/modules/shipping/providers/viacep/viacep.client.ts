import type {
  ViaCepResponse,
} from "./viacep.types.js";

export class ViaCepClient {
  private readonly baseUrl =
    "https://viacep.com.br/ws";

  async findByCep(
    cep: string,
  ): Promise<ViaCepResponse | null> {
    const normalizedCep =
      cep.replace(/\D/g, "");

    const response =
      await fetch(
        `${this.baseUrl}/${normalizedCep}/json/`,
      );

    if (!response.ok) {
      throw new Error(
        "Failed to query CEP provider",
      );
    }

    const data =
      (await response.json()) as ViaCepResponse;

    if (data.erro) {
      return null;
    }

    return data;
  }
}