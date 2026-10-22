import fs from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

const read = (p: string) => fs.readFileSync(path.join("dist", p), "utf8");

test("home shows featured, works, pills", () => {
  const h = read("index.html");
  expect(h).toContain("simplePages");
  expect(h).toContain("/works/green/");
  expect(h).toContain('data-group="car"');
  expect(h).not.toContain('data-group="diy"');
});
test("home en", () => {
  const h = read("en/index.html");
  expect(h).toContain("Recent posts");
  expect(h).toContain('href="/en/works/"');
});
