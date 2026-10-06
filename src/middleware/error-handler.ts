import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  console.error(error);

  if (
    error &&
    typeof error === "object" &&
    "type" in error &&
    error.type === "entity.too.large"
  ) {
    return res.status(413).json({
      error: {
        message: "Request body too large",
      },
    });
  }

  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }

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
