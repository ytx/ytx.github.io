import fs from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

const read = (p: string) => fs.readFileSync(path.join("dist", p), "utf8");

test("home shows featured, works", () => {
  const h = read("index.html");
  expect(h).toContain("simplePages");
  expect(h).toContain("/works/green/");
});
test("home links to note magazines instead of the blog", () => {
  const h = read("index.html");
  expect(h).toContain("https://note.com/ytx/m/mf2b659b6b740");
  expect(h).toContain("https://note.com/ytx/m/mbff238b62080");
  expect(h).not.toContain('href="/blog/"');
});
test("home en", () => {
  const h = read("en/index.html");
  expect(h).toContain("Development notes");
  expect(h).toContain('href="/en/works/"');
});
