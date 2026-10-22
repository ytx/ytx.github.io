import { expect, test } from "vitest";
import { categoryName, childrenOf, parents, parseCategoryPath } from "../../src/data/categories";

test("parses parent/child", () => expect(parseCategoryPath("car/maintenance")).toEqual({ parent: "car", child: "maintenance" }));
test("parses parent only", () => expect(parseCategoryPath("car")).toEqual({ parent: "car" }));
test("rejects unknown parent", () => expect(parseCategoryPath("food")).toBeNull());
test("rejects child under wrong parent", () => expect(parseCategoryPath("travel/maintenance")).toBeNull());
test("rejects 3 levels", () => expect(parseCategoryPath("car/maintenance/oil")).toBeNull());
test("names both languages", () => {
  expect(categoryName("car", "ja")).toBe("車");
  expect(categoryName("car", "en")).toBe("Car");
});
test("childrenOf", () => expect(childrenOf("car").map((c) => c.slug)).toEqual(["maintenance"]));
test("parents excludes children", () => expect(parents().map((c) => c.slug)).toEqual(["gadget", "car", "travel", "diy", "howto"]));
