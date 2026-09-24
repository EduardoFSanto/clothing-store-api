import type {
  FrenetQuoteInput,
  FrenetQuoteResponse,
} from "./frenet.types.js";

export class FrenetClient {
  private readonly baseUrl =
    process.env.FRENET_API_URL ?? "http://api.frenet.com.br";

  private readonly token = process.env.FRENET_TOKEN;

  async calculateQuote(
    input: FrenetQuoteInput,
  ): Promise<FrenetQuoteResponse> {
    if (!this.token) {
      throw new Error("FRENET_TOKEN is not configured");
    }

    const response = await fetch(
      `${this.baseUrl}/shipping/quote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: this.token,
        },
        body: JSON.stringify({
          SellerCEP: input.originCep,
          RecipientCEP: input.destinationCep,
          ShipmentInvoiceValue: input.invoiceValue,
          RecipientCountry: "BR",
          ShippingItemArray: input.items,
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );

    const responseText = await response.text();

    let responseData: unknown;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      throw new Error(
        "Frenet returned an invalid JSON response",
      );
    }

    if (!response.ok) {
      throw new Error(
        `Frenet request failed with status ${response.status}`,
      );
    }

    return responseData as FrenetQuoteResponse;
  }
}
