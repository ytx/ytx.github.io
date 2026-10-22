import fs from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

const read = (p: string) => fs.readFileSync(path.join("dist", p), "utf8");

test("category pages exist incl. empty", () => {
  expect(read("blog/howto/index.html")).toContain("/blog/howto/simplepages-howto/");
  expect(read("blog/diy/index.html")).toContain("まだ記事がありません");
});
test("parent category includes child posts", () =>
  expect(read("blog/car/index.html")).toContain("/blog/car/maintenance/oil-change/"));
test("post page has breadcrumb, code highlight", () => {
  const h = read("blog/car/maintenance/oil-change/index.html");
  expect(h).toContain('href="/blog/car/maintenance/"');
  expect(h).toContain("astro-code");
});
test("draft excluded from build", () =>
  expect(fs.existsSync("dist/blog/gadget/draft-sample/index.html")).toBe(false));
test("en untranslated post shows ja body with notice", () => {
  const h = read("en/blog/car/maintenance/oil-change/index.html");
  expect(h).toContain("available in Japanese only");
  expect(h).toContain('<html lang="ja"');
});
test("en translated post", () => {
  const h = read("en/blog/howto/simplepages-howto/index.html");
  expect(h).not.toContain("Japanese only");
  expect(h).toContain('<html lang="en"');
  expect(h).toContain('href="/en/works/simplepages/"');
});
