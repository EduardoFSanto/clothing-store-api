export type CorreiosShippingQuoteInput = {
  originCep: string;
  destinationCep: string;

  weightInGrams: number;

  lengthInCentimeters: number;
  heightInCentimeters: number;
  widthInCentimeters: number;
};

export type CorreiosShippingQuote = {
  amountInCents: number;
  deliveryTimeInDays: number;
  serviceCode: string;
  provider: "correios";
};