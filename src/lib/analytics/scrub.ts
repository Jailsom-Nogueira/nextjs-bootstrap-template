const PII_KEYS = ["email", "phone", "password", "token", "ssn", "address", "ip", "credit_card"];

/**
 * Strip PII from event properties before sending to analytics.
 * Centralized so we have one place to audit privacy.
 */
export function scrubPII<T extends Record<string, unknown>>(props: T): T {
  const out = { ...props };
  for (const key of Object.keys(out)) {
    if (PII_KEYS.some((p) => key.toLowerCase().includes(p))) {
      out[key as keyof T] = "[scrubbed]" as T[keyof T];
    }
  }
  return out;
}
