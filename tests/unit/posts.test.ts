import { describe, expect, it } from "vitest";
import {
  assertNoSlugCollision,
  assertWorkRefs,
  buildPosts,
  filterByCategory,
  latestPerParent,
  type Post,
  type PostData,
} from "../../src/lib/posts-core";

function postLike(o: { slug: string; category: string; published?: string; work?: string }): Post {
  const [parent, child] = o.category.split("/");
  const data: PostData = {
    title: o.slug,
    description: "",
    category: o.category,
    work: o.work,
    published: new Date(o.published ?? "2026-01-01"),
    draft: false,
  };
  return { slug: o.slug, lang: "ja", data, translated: true, entry: null, category: { parent, child } };
}

const posts = [
  postLike({ slug: "oil-change", category: "car/maintenance", published: "2026-03-01" }),
  postLike({ slug: "car-intro", category: "car", published: "2026-02-01" }),
  postLike({ slug: "first-gadget", category: "gadget", published: "2026-01-15" }),
];

describe("filterByCategory", () => {
  it("親指定は子を含み、入力順を保つ", () => {
    expect(filterByCategory(posts, "car").map((p) => p.slug)).toEqual(["oil-change", "car-intro"]);
  });
  it("子指定は子だけ", () => {
    expect(filterByCategory(posts, "car", "maintenance").map((p) => p.slug)).toEqual(["oil-change"]);
  });
});

describe("latestPerParent", () => {
  it("記事 0 件の親はキー無し、n 件で切る", () => {
    const r = latestPerParent(posts, 1);
    expect(Object.keys(r).sort()).toEqual(["car", "gadget"]);
    expect(r.car.map((p) => p.slug)).toEqual(["oil-change"]);
    expect(Object.keys(r)).not.toContain("diy");
  });
});

describe("assertNoSlugCollision", () => {
  it("記事 slug が同親の子カテゴリ slug と同じなら throw", () => {
    expect(() => assertNoSlugCollision([postLike({ slug: "maintenance", category: "car" })])).toThrow(/collision/);
  });
  it("子カテゴリに置いた記事は同名 slug でも衝突しない", () => {
    expect(() => assertNoSlugCollision([postLike({ slug: "maintenance", category: "car/maintenance" })])).not.toThrow();
  });
  it("衝突が無ければ通る", () => {
    expect(() => assertNoSlugCollision(posts)).not.toThrow();
  });
});

describe("assertWorkRefs", () => {
  it("存在しない work なら throw", () => {
    expect(() => assertWorkRefs([postLike({ slug: "x", category: "howto", work: "nope" })], ["a"])).toThrow(/work/);
  });
  it("存在すれば通る", () => {
    expect(() => assertWorkRefs([postLike({ slug: "x", category: "howto", work: "a" })], ["a"])).not.toThrow();
  });
});

describe("buildPosts", () => {
  const base = { description: "d", category: "car/maintenance", draft: false };
  const entries = [
    { id: "old", data: { ...base, title: "old", published: new Date("2026-01-01") } },
    { id: "new", data: { ...base, title: "new", published: new Date("2026-05-01") } },
    { id: "new.en", data: { ...base, title: "new-en", published: new Date("2026-05-01") } },
    { id: "wip", data: { ...base, title: "wip", draft: true, published: new Date("2026-06-01") } },
  ];
  it("published 降順、category を解析し、英語版を採用する", () => {
    const r = buildPosts(entries, "en", { excludeDrafts: false });
    expect(r.map((p) => p.slug)).toEqual(["wip", "new", "old"]);
    expect(r[1].data.title).toBe("new-en");
    expect(r[1].category).toEqual({ parent: "car", child: "maintenance" });
  });
  it("excludeDrafts で draft を除く", () => {
    expect(buildPosts(entries, "ja", { excludeDrafts: true }).map((p) => p.slug)).toEqual(["new", "old"]);
  });
});
