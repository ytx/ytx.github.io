import { describe, expect, it } from "vitest";
import { pairByLang } from "../../src/lib/pair";

const items = [
  { id: "a", data: { title: "A" } },
  { id: "a.en", data: { title: "A-en" } },
  { id: "b", data: { title: "B" } },
];

describe("pairByLang", () => {
  it("en では英語版を優先し、無ければ日本語版にフォールバックする", () => {
    expect(pairByLang(items, "en").map((x) => [x.slug, x.data.title, x.translated])).toEqual([
      ["a", "A-en", true],
      ["b", "B", false],
    ]);
  });
  it("ja では全件が translated", () => {
    expect(pairByLang(items, "ja").every((x) => x.translated)).toBe(true);
  });
  it("lang は実際に採用した版の言語", () => {
    expect(pairByLang(items, "en").map((x) => x.lang)).toEqual(["en", "ja"]);
  });
  it("merge で英語側に無い項目を日本語側から引き継ぐ", () => {
    const w = [
      { id: "g/index", data: { title: "g", url: "https://x" } as Record<string, string> },
      { id: "g/index.en", data: { title: "G" } as Record<string, string> },
    ];
    expect(pairByLang(w, "en", (b, o) => ({ ...b, ...o }))[0].data).toEqual({
      title: "G",
      url: "https://x",
    });
  });
  it("entry を引き継ぐ", () => {
    const e = { id: "a", data: { title: "A" }, entry: "E" };
    expect(pairByLang([e], "ja")[0].entry).toBe("E");
  });
});
