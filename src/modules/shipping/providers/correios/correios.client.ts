import type {
  CorreiosShippingQuote,
  CorreiosShippingQuoteInput,
} from "./correios.types.js";

export class CorreiosClient {
  private readonly baseUrl =
    process.env.CORREIOS_API_URL ??
    "https://api.correios.com.br";

  private readonly token =
    process.env.CORREIOS_API_TOKEN;

  private readonly serviceCode =
    process.env.CORREIOS_SERVICE_CODE;

  async calculateQuote(
    input: CorreiosShippingQuoteInput,
  ): Promise<CorreiosShippingQuote> {
    if (!this.token) {
      throw new Error(
        "Correios API token is not configured",
      );
    }

    if (!this.serviceCode) {
      throw new Error(
        "Correios service code is not configured",
      );
    }

    /*
     * A integração oficial dos Correios depende
     * do contrato/serviço habilitado para a conta.
     *
     * Não vamos inventar um endpoint ou payload
     * específico enquanto as credenciais e o
     * serviço contratado não estiverem definidos.
     */

    void this.baseUrl;
    void input;

    throw new Error(
      "Correios price calculation is not configured for this account",
    );
  }
}