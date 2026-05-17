import { describe, it, expect } from "vitest";
import { scrubPII } from "@/lib/analytics/scrub";

describe("scrubPII", () => {
  it("redacts PII keys", () => {
    const out = scrubPII({ email: "x@y.com", name: "Example User", phone: "555" });
    expect(out.email).toBe("[scrubbed]");
    expect(out.phone).toBe("[scrubbed]");
    expect(out.name).toBe("Example User");
  });

  it("is case-insensitive", () => {
    const out = scrubPII({ Email: "x@y.com" });
    expect(out.Email).toBe("[scrubbed]");
  });
});
