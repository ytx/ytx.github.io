import { describe, expect, it } from "vitest";
import { pickFrom, pickPlaceholder, placeholderCount } from "../../src/lib/placeholders";

describe("placeholders", () => {
  it("同じキーなら同じ画像を返す", () => {
    expect(pickPlaceholder("a")).toBe(pickPlaceholder("a"));
  });
  it("現在のプールは 10 枚", () => {
    expect(placeholderCount()).toBe(10);
  });
  it("pickFrom は空のとき fallback を返し、決定的に選ぶ", () => {
    expect(pickFrom([], "x", "fb")).toBe("fb");
    const pool = ["a", "b", "c"];
    expect(pickFrom(pool, "k", "fb")).toBe(pickFrom(pool, "k", "fb"));
    expect(pool).toContain(pickFrom(pool, "k", "fb"));
  });
});
