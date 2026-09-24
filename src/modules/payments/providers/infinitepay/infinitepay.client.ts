import {
  createInfinitePayCheckoutSchema,
  infinitePayCheckoutResponseSchema,
} from "./infinitepay.schemas.js";

import type {
  CreateInfinitePayCheckoutPayload,
  InfinitePayCheckoutResponse,
} from "./infinitepay.types.js";

export class InfinitePayClient {
  private readonly apiUrl: string;
  private readonly handle: string;

  constructor() {
    const apiUrl =
      process.env.INFINITEPAY_API_URL;

    const handle =
      process.env.INFINITEPAY_HANDLE;

    if (!apiUrl) {
      throw new Error(
        "INFINITEPAY_API_URL is not configured",
      );
    }

    if (!handle) {
      throw new Error(
        "INFINITEPAY_HANDLE is not configured",
      );
    }

    this.apiUrl =
      apiUrl.replace(/\/+$/, "");

    this.handle =
      handle.trim().replace(
        /^\$/,
        "",
      );
  }

  async createCheckout(
    payload: Omit<
      CreateInfinitePayCheckoutPayload,
      "handle"
    >,
  ): Promise<InfinitePayCheckoutResponse> {
    const requestBody =
      createInfinitePayCheckoutSchema.parse({
        ...payload,
        handle: this.handle,
      });

    const response =
      await fetch(
        `${this.apiUrl}/links`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            requestBody,
          ),

          signal:
            AbortSignal.timeout(
              10_000,
            ),
        },
      );

    const responseText =
      await response.text();

    let responseData: unknown;

    try {
      responseData =
        JSON.parse(
          responseText,
        );
    } catch {
      responseData =
        responseText;
    }

    if (!response.ok) {
      const providerMessage =
        typeof responseData ===
        "string"
          ? responseData
          : JSON.stringify(
              responseData,
            );

      throw new Error(
        `InfinitePay request failed with status ${response.status}: ${providerMessage}`,
      );
    }

    const parsedResponse =
      infinitePayCheckoutResponseSchema.safeParse(
        responseData,
      );

    if (!parsedResponse.success) {
      throw new Error(
        "Invalid response received from InfinitePay",
      );
    }

    return parsedResponse.data;
  }
}