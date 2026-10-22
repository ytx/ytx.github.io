import fs from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

const read = (p: string) => fs.readFileSync(path.join("dist", p), "utf8");
const has = (p: string) => fs.existsSync(path.join("dist", p));
// サンプル記事が draft のときは、記事ページに依存するテストをスキップする
const withPosts = test.skipIf(!has("blog/car/maintenance/oil-change/index.html"));

test("empty category page shows notice", () =>
  expect(read("blog/diy/index.html")).toContain("まだ記事がありません"));
withPosts("category page lists posts", () =>
  expect(read("blog/howto/index.html")).toContain("/blog/howto/simplepages-howto/"));
withPosts("parent category includes child posts", () =>
  expect(read("blog/car/index.html")).toContain("/blog/car/maintenance/oil-change/"));
withPosts("post page has breadcrumb, code highlight", () => {
  const h = read("blog/car/maintenance/oil-change/index.html");
  expect(h).toContain('href="/blog/car/maintenance/"');
  expect(h).toContain("astro-code");
});
test("draft excluded from build", () =>
  expect(has("blog/gadget/draft-sample/index.html")).toBe(false));
withPosts("en untranslated post shows ja body with notice", () => {
  const h = read("en/blog/car/maintenance/oil-change/index.html");
  expect(h).toContain("available in Japanese only");
  expect(h).toContain('<html lang="ja"');
});
withPosts("en translated post", () => {
  const h = read("en/blog/howto/simplepages-howto/index.html");
  expect(h).not.toContain("Japanese only");
  expect(h).toContain('<html lang="en"');
  expect(h).toContain('href="/en/works/simplepages/"');
});
