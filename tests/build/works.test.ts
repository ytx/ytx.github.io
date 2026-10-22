import fs from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

const read = (p: string) => fs.readFileSync(path.join("dist", p), "utf8");

test("works index lists parents only", () => {
  const h = read("works/index.html");
  expect(h).toContain("/works/simplepages/");
  expect(h).not.toContain("/works/l-timer/");
});
test("parent work shows children", () => {
  const h = read("works/simplepages/index.html");
  expect(h).toContain("/works/l-timer/");
  expect(h).toContain("使ってみる");
  expect(h).toContain("/blog/howto/simplepages-howto/");
});
test("child work has breadcrumb to parent", () =>
  expect(read("works/l-timer/index.html")).toContain('href="/works/simplepages/"'));
test("web work uses visit label", () =>
  expect(read("works/green/index.html")).toContain("サイトを見る"));
test("en work page", () => {
  const h = read("en/works/green/index.html");
  expect(h).toContain("Visit site");
  expect(h).toContain('hreflang="ja" href="https://ytx.github.io/works/green/"');
});
