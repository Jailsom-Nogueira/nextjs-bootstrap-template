import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    ok: true,
    version: process.env.npm_package_version ?? "0.0.0",
    timestamp: new Date().toISOString(),
  });
}
