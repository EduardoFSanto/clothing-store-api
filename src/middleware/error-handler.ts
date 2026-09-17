import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  console.error(error);

  if (error instanceof Error) {
    return res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }

  return res.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
};