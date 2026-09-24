export type FrenetShippingItem = {
  Height: number;
  Length: number;
  Quantity: number;
  Weight: number;
  Width: number;
};

export type FrenetQuoteInput = {
  originCep: string;
  destinationCep: string;
  invoiceValue: number;
  items: FrenetShippingItem[];
};

export type FrenetShippingOption = {
  ServiceCode?: string;
  ServiceDescription?: string;
  Carrier?: string;
  ShippingPrice?: number;
  DeliveryTime?: number;
  Error?: boolean;
  Msg?: string;
};

export type FrenetQuoteResponse = {
  ShippingSevicesArray?: FrenetShippingOption[];
  [key: string]: unknown;
};
