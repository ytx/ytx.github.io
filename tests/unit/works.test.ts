import { describe, expect, it } from "vitest";
import { buildWorks, primaryAction, type WorkData } from "../../src/lib/works-core";

function entryLike(o: { id: string } & Partial<WorkData>) {
  const { id, ...rest } = o;
  const data: WorkData = {
    title: id,
    summary: "s",
    type: "web",
    url: "https://example.com",
    ...rest,
  };
  return { id, data };
}

const entries = [
  entryLike({ id: "green/index", featured: true, order: 10 }),
  entryLike({ id: "kaji0/index", order: 20 }),
  entryLike({ id: "simplepages/index", featured: true, order: 30 }),
  entryLike({ id: "l-timer/index", parent: "simplepages", order: 10 }),
  entryLike({ id: "weather/index", parent: "simplepages", order: 20 }),
  { id: "green/index.en", data: { title: "Green", summary: "en" } as WorkData },
];

describe("buildWorks", () => {
  it("親のみ order 昇順で、children を詰める", () => {
    const r = buildWorks(entries, "ja");
    expect(r.parents.map((w) => w.slug)).toEqual(["green", "kaji0", "simplepages"]);
    expect(r.parents[2].children.map((w) => w.slug)).toEqual(["l-timer", "weather"]);
    expect(r.all).toHaveLength(5);
    expect(r.all.find((w) => w.slug === "weather")?.parentSlug).toBe("simplepages");
  });
  it("featured 全件", () => {
    expect(buildWorks(entries, "ja").featured.map((w) => w.slug)).toEqual(["green", "simplepages"]);
  });
  it("子作品の featured も拾う", () => {
    const withChild = entries.map((e) => (e.id === "l-timer/index" ? { ...e, data: { ...e.data, featured: true } } : e));
    expect(buildWorks(withChild, "ja").featured.map((w) => w.slug)).toContain("l-timer");
  });
  it("featured の子作品は親のすぐあとに並ぶ", () => {
    const all = entries.map((e) => (e.id.endsWith(".en") ? e : { ...e, data: { ...e.data, featured: true } }));
    expect(buildWorks(all, "ja").featured.map((w) => w.slug)).toEqual(["green", "kaji0", "simplepages", "l-timer", "weather"]);
  });
  it("featured 0 件なら親の先頭 1 件", () => {
    const none = entries.map((e) => ({ ...e, data: { ...e.data, featured: undefined } }));
    expect(buildWorks(none, "ja").featured.map((w) => w.slug)).toEqual(["green"]);
  });
  it("en は日本語側から url 等を引き継ぐ", () => {
    const w = buildWorks(entries, "en").parents.find((x) => x.slug === "green")!;
    expect(w.data.title).toBe("Green");
    expect(w.data.url).toBe("https://example.com");
    expect(w.translated).toBe(true);
  });
  it("存在しない parent は throw", () => {
    expect(() => buildWorks([...entries, entryLike({ id: "x/index", parent: "nope" })], "ja")).toThrow(/parent/);
  });
  it("孫は throw", () => {
    expect(() => buildWorks([...entries, entryLike({ id: "y/index", parent: "l-timer" })], "ja")).toThrow(/grandchild/);
  });
  it("日本語版が無い作品（英語版のみ）は throw", () => {
    const enOnly = { id: "solo/index.en", data: { title: "Solo", summary: "s" } as WorkData };
    expect(() => buildWorks([...entries, enOnly], "en")).toThrow(/missing ja.*solo/);
  });
  it("日本語側の必須項目が無ければ throw", () => {
    const bad = entryLike({ id: "z/index" });
    delete (bad.data as Partial<WorkData>).type;
    expect(() => buildWorks([...entries, bad], "ja")).toThrow(/type/);
  });
  it("thumbnail は省略できる", () => {
    expect(() => buildWorks(entries, "ja")).not.toThrow();
  });
  it("主ボタンにリンク先が無ければ throw", () => {
    const noUrl = entryLike({ id: "u/index", url: undefined });
    expect(() => buildWorks([...entries, noUrl], "ja")).toThrow(/url/);
    const noRepo = entryLike({ id: "r/index", url: undefined, access: "source" });
    expect(() => buildWorks([...entries, noRepo], "ja")).toThrow(/repo/);
  });
  it("問い合わせの作品は url が無くてよい", () => {
    const c = entryLike({ id: "c/index", type: "device", url: undefined, access: "contact" });
    expect(() => buildWorks([...entries, c], "ja")).not.toThrow();
  });
});

describe("primaryAction", () => {
  const base: WorkData = { title: "t", summary: "s", type: "app", url: "https://example.com/" };
  it("access 省略時は type から決める", () => {
    expect(primaryAction(base)).toEqual({ kind: "try", href: "https://example.com/" });
    expect(primaryAction({ ...base, type: "web" })).toEqual({ kind: "visit", href: "https://example.com/" });
    expect(primaryAction({ ...base, type: "desktop" }).kind).toBe("visit");
  });
  it("download は url、source は repo へ", () => {
    expect(primaryAction({ ...base, access: "download" })).toEqual({ kind: "download", href: "https://example.com/" });
    expect(primaryAction({ ...base, url: undefined, repo: "https://github.com/x/y", access: "source" })).toEqual({
      kind: "source",
      href: "https://github.com/x/y",
    });
  });
  it("contact はリンク先を持たない", () => {
    expect(primaryAction({ ...base, url: undefined, access: "contact" })).toEqual({ kind: "contact" });
  });
});
