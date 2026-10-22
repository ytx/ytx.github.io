import { describe, expect, it } from "vitest";
import { parseId } from "../../src/lib/ids";

describe("parseId", () => {
  it("作品の id を slug と言語に分ける", () => {
    expect(parseId("green/index")).toEqual({ slug: "green", lang: "ja" });
    expect(parseId("green/index.en")).toEqual({ slug: "green", lang: "en" });
  });
  it("記事の id を slug と言語に分ける", () => {
    expect(parseId("oil-change")).toEqual({ slug: "oil-change", lang: "ja" });
    expect(parseId("oil-change.en")).toEqual({ slug: "oil-change", lang: "en" });
  });
});
