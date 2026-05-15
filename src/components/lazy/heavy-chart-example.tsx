"use client";

/**
 * Tiny placeholder used to demonstrate the `lazyClient` pattern.
 * Replace with a real chart (recharts, chart.js, etc.) when needed.
 *
 * Marked `"use client"` so it ships in a separate chunk and is only
 * downloaded when this module is imported.
 */
export default function HeavyChartExample() {
  return (
    <div
      data-testid="heavy-chart-example"
      className="border-border bg-card text-card-foreground flex h-64 w-full items-center justify-center rounded-md border"
    >
      <span className="text-muted-foreground text-sm">Chart loaded (client)</span>
    </div>
  );
}
