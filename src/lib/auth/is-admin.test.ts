import { describe, it, expect, vi, beforeEach } from "vitest";

// `server-only` throws when imported from a non-RSC context. Stub it for unit tests.
vi.mock("server-only", () => ({}));

// Mock the Supabase server client before importing the module under test.
const getUserMock = vi.fn();
const fromMock = vi.fn();

vi.mock("@/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: getUserMock },
    from: fromMock,
  }),
}));

import { isAdmin } from "@/lib/auth/is-admin";

describe("isAdmin", () => {
  beforeEach(() => {
    getUserMock.mockReset();
    fromMock.mockReset();
  });

  it("returns false when there is no user", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    expect(await isAdmin()).toBe(false);
  });

  it("returns true when profile.role is 'admin'", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
    fromMock.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: { role: "admin" }, error: null }),
        }),
      }),
    });
    expect(await isAdmin()).toBe(true);
  });

  it("returns false when profile.role is 'user'", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
    fromMock.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: { role: "user" }, error: null }),
        }),
      }),
    });
    expect(await isAdmin()).toBe(false);
  });

  it("returns false when the query errors", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
    fromMock.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: { message: "boom" } }),
        }),
      }),
    });
    expect(await isAdmin()).toBe(false);
  });
});
