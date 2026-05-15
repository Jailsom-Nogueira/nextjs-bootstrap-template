import "server-only";

import { Resend } from "resend";
import { env } from "@/env";

let _client: Resend | null = null;

export function getResend(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  if (_client) return _client;
  _client = new Resend(env.RESEND_API_KEY);
  return _client;
}
