import type { RequestHandler } from "express";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

const entries = new Map<string, RateLimitEntry>();

function cleanupExpiredEntries(now: number) {
  for (const [key, entry] of entries) {
    if (entry.resetAt <= now) {
      entries.delete(key);
    }
  }
}

export function createRateLimiter(
  options: RateLimitOptions,
): RequestHandler {
  return (req, res, next) => {
    const now = Date.now();

    cleanupExpiredEntries(now);

    const key = req.ip ?? "unknown";
    const current = entries.get(key);

    if (!current || current.resetAt <= now) {
      entries.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });

      return next();
    }

    current.count += 1;

    if (current.count > options.max) {
      const retryAfterSeconds = Math.ceil(
        (current.resetAt - now) / 1000,
      );

      res.setHeader(
        "Retry-After",
        retryAfterSeconds,
      );

      return res.status(429).json({
        error: {
          message:
            "Too many requests. Please try again later.",
        },
      });
    }

    return next();
  };
}

export const loginRateLimiter =
  createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
  });

export const customerRateLimiter =
  createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
  });

export const orderRateLimiter =
  createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
  });

export const paymentRateLimiter =
  createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
  });

export const shippingRateLimiter =
  createRateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 30,
  });
