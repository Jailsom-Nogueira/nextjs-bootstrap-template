import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { lazyClient } from "@/lib/lazy";

describe("lazyClient", () => {
  it("returns a renderable component with a skeleton fallback", () => {
    const Lazy = lazyClient(() => import("@/components/lazy/heavy-chart-example"));
    const { container } = render(<Lazy />);
    // While the dynamic component loads, the skeleton fallback is in the DOM.
    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull();
  });

  it("accepts a custom skeleton className", () => {
    const Lazy = lazyClient(() => import("@/components/lazy/heavy-chart-example"), {
      skeletonClassName: "h-32 w-32",
    });
    const { container } = render(<Lazy />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).not.toBeNull();
    expect(skeleton?.className).toContain("h-32");
    expect(skeleton?.className).toContain("w-32");
  });
});
