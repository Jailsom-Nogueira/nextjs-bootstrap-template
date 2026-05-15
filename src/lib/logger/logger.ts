import pino from "pino";

/**
 * Centralized logger. Use instead of `console.log` (banned by ESLint).
 * `console.warn` and `console.error` are still allowed for genuine warnings/errors.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug"),
  base: null,
  redact: {
    paths: [
      "password",
      "*.password",
      "token",
      "*.token",
      "authorization",
      "*.authorization",
      "cookie",
      "*.cookie",
      "email",
      "*.email",
    ],
    censor: "[redacted]",
  },
});

export type Logger = typeof logger;
