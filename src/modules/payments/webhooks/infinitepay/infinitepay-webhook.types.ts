export type InfinitePayWebhookItem = {
  quantity: number;
  price: number;
  description: string;
};

export type InfinitePayWebhookPayload = {
  invoice_slug: string;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: "credit_card" | "pix";
  transaction_nsu: string;
  order_nsu: string;
  receipt_url: string;
  items: InfinitePayWebhookItem[];
};