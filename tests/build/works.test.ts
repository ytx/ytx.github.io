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
});
test.skipIf(!fs.existsSync("dist/blog/howto/simplepages-howto/index.html"))("parent work lists how-to posts", () =>
  expect(read("works/simplepages/index.html")).toContain("/blog/howto/simplepages-howto/"));
test("child work has breadcrumb to parent", () =>
  expect(read("works/l-timer/index.html")).toContain('href="/works/simplepages/"'));
test("web work uses visit label", () =>
  expect(read("works/green/index.html")).toContain("サイトを見る"));
test("en work page", () => {
  const h = read("en/works/green/index.html");
  expect(h).toContain("Visit site");
  expect(h).toContain('hreflang="ja" href="https://ytx.github.io/works/green/"');
});
test("download work uses download label and keeps source link", () => {
  const h = read("works/memo3/index.html");
  expect(h).toContain("ダウンロード");
  expect(h).toContain('href="https://xpenguin.biz/memo3/"');
  expect(h).toContain("ソースコード");
});
test("source work links to GitHub once", () => {
  const h = read("works/webarchive-server/index.html");
  expect(h).toContain("GitHub で見る");
  expect(h).not.toContain(">ソースコード<");
});
test("contact work has an encoded mail link and closed badge", () => {
  const h = read("works/km-hub/index.html");
  expect(h).toContain("お問い合わせ");
  expect(h).toContain("data-mail=");
  expect(read("works/index.html")).toContain("コード非公開");
});
test("no page or script exposes the contact address", () => {
  const files = fs.readdirSync("dist", { recursive: true, encoding: "utf8" }).filter((f) => /\.(html|js|xml)$/.test(f));
  const address = ["info", "xpenguin.biz"].join("@");
  for (const f of files) {
    const s = read(f);
    expect(s, f).not.toContain(address);
    expect(s, f).not.toContain("mailto:info");
  }
});
test("work without thumbnail still has a card image", () =>
  expect(read("works/index.html")).toMatch(/href="\/works\/sound-pi\/"[\s\S]*?<img/));
