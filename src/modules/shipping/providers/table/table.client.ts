import type { ShippingQuoteResult } from "../../shipping.types.js";

type ShippingRegion =
  | "sudeste"
  | "sul"
  | "centro-oeste"
  | "nordeste"
  | "norte";

type ShippingRule = {
  region: ShippingRegion;
  states: string[];
  amountInCents: number;
  deliveryTimeInDays: number;
};

const shippingRules: ShippingRule[] = [
  {
    region: "sudeste",
    states: ["RJ", "SP", "MG", "ES"],
    amountInCents: 1990,
    deliveryTimeInDays: 5,
  },
  {
    region: "sul",
    states: ["PR", "SC", "RS"],
    amountInCents: 2490,
    deliveryTimeInDays: 7,
  },
  {
    region: "centro-oeste",
    states: ["GO", "MT", "MS", "DF"],
    amountInCents: 2790,
    deliveryTimeInDays: 8,
  },
  {
    region: "nordeste",
    states: [
      "BA",
      "SE",
      "AL",
      "PE",
      "PB",
      "RN",
      "CE",
      "PI",
      "MA",
    ],
    amountInCents: 2990,
    deliveryTimeInDays: 10,
  },
  {
    region: "norte",
    states: [
      "AM",
      "RR",
      "AP",
      "PA",
      "TO",
      "RO",
      "AC",
    ],
    amountInCents: 3490,
    deliveryTimeInDays: 12,
  },
];

export class TableShippingClient {
  calculateQuote(state: string): ShippingQuoteResult {
    const normalizedState = state.trim().toUpperCase();

    const rule = shippingRules.find((current) =>
      current.states.includes(normalizedState),
    );

    if (!rule) {
      throw new Error(
        `Shipping is not available for state ${normalizedState}`,
      );
    }

    return {
      amountInCents: rule.amountInCents,
      deliveryTimeInDays: rule.deliveryTimeInDays,
      serviceCode: `TABLE-${rule.region.toUpperCase()}`,
      provider: "table",
    };
  }
}