import type {
  Request,
  Response,
} from "express";

import {
  infinitePayWebhookSchema,
} from "./infinitepay-webhook.schemas.js";

import {
  InfinitePayWebhookService,
} from "./infinitepay-webhook.service.js";

import {
  PaymentsRepository,
} from "../../payments.repository.js";

const paymentsRepository =
  new PaymentsRepository();

const webhookService =
  new InfinitePayWebhookService(
    paymentsRepository,
  );

export async function infinitePayWebhookController(
  req: Request,
  res: Response,
) {
  const input =
    infinitePayWebhookSchema.safeParse(
      req.body,
    );

  if (!input.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid webhook payload",
    });
  }

  try {
    await webhookService.process(
      input.data,
    );

    return res.status(200).json({
      success: true,
      message: null,
    });
  } catch (error) {
    console.error(
      "InfinitePay webhook error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to process webhook",
    });
  }
}