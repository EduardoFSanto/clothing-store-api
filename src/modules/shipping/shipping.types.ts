export type ShippingAddress = {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type ShippingQuoteResult = {
  amountInCents: number;
  deliveryTimeInDays: number;
  serviceCode: string;
  provider: "table";
};