import { expect, test } from "vitest";
import { localePrefix, homeUrl, worksUrl, workUrl, blogUrl, categoryUrl, postUrl, aboutUrl, rssUrl } from "../../src/lib/urls";

test("urls ja", () => {
  expect(postUrl("ja", "car/maintenance", "oil")).toBe("/blog/car/maintenance/oil/");
  expect(categoryUrl("ja", "car")).toBe("/blog/car/");
  expect(rssUrl("ja")).toBe("/rss.xml");
  expect(localePrefix("ja")).toBe("");
  expect(homeUrl("ja")).toBe("/");
  expect(worksUrl("ja")).toBe("/works/");
  expect(blogUrl("ja")).toBe("/blog/");
  expect(aboutUrl("ja")).toBe("/about/");
});
test("urls en", () => {
  expect(workUrl("en", "green")).toBe("/en/works/green/");
  expect(homeUrl("en")).toBe("/en/");
  expect(rssUrl("en")).toBe("/en/rss.xml");
  expect(localePrefix("en")).toBe("/en");
  expect(postUrl("en", "car/maintenance", "oil")).toBe("/en/blog/car/maintenance/oil/");
  expect(aboutUrl("en")).toBe("/en/about/");
});
