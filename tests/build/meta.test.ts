import fs from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

const read = (p: string) => fs.readFileSync(path.join("dist", p), "utf8");

test("about pages", () => {
  expect(read("about/index.html")).toContain("<article");
  expect(read("en/about/index.html")).toContain('<html lang="en"');
});
test("rss both languages", () => {
  expect(read("rss.xml")).toContain("<language>ja</language>");
  expect(read("en/rss.xml")).toContain("<language>en</language>");
});
test.skipIf(!fs.existsSync("dist/en/blog/howto/simplepages-howto/index.html"))("en rss lists posts", () =>
  expect(read("en/rss.xml")).toContain("/en/blog/howto/simplepages-howto/"));
test("sitemap has alternates", () => {
  const s = read("sitemap-0.xml");
  expect(s).toContain('hreflang="en"');
  expect(s).toContain("https://ytx.github.io/en/works/green/");
});
test("og tags", () => {
  const h = read("works/green/index.html");
  expect(h).toContain('property="og:title"');
  expect(h).toContain('property="og:image"');
});
test("404 pages", () => {
  expect(read("404.html")).toContain("ページが見つかりません");
  expect(read("en/404/index.html")).toContain("Page not found");
});
