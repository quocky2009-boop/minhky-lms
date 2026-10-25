import { describe, expect, it } from "vitest";
import { resolveDataSource } from "@/lib/env";

describe("resolveDataSource", () => {
  it("mặc định là mock khi phát triển", () => {
    expect(resolveDataSource(undefined, "development")).toBe("mock");
  });

  it("cho phép supabase ở production", () => {
    expect(resolveDataSource("supabase", "production")).toBe("supabase");
  });

  it("chặn mock ở production (kể cả khi biến để trống)", () => {
    expect(() => resolveDataSource("mock", "production")).toThrow();
    expect(() => resolveDataSource(undefined, "production")).toThrow();
  });

  it("từ chối giá trị lạ", () => {
    expect(() => resolveDataSource("sqlite", "development")).toThrow();
  });
});
