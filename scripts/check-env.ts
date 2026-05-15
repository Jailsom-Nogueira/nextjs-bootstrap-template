/**
 * Manual env check helper. Run with: `tsx scripts/check-env.ts`
 * Useful in deployment pipelines to fail fast if vars are missing.
 */
import { env } from "../src/env";

// Trigger validation by accessing a field.
const _ = env.NEXT_PUBLIC_SITE_URL;
void _;

console.warn("✓ env validation passed");
