import { beforeAll, describe, expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Hero from "../../src/components/Hero.astro";
import { fakeWork } from "../helpers/fixtures";

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("Hero", () => {
  test("1 work has no dots", async () => {
    const h = await container.renderToString(Hero, { props: { lang: "ja", works: [fakeWork()] } });
    expect(h).not.toContain("hero-dots");
    expect(h).toContain("サンプル作品");
  });
  test("2 works have dots and both titles", async () => {
    const h = await container.renderToString(Hero, {
      props: { lang: "ja", works: [fakeWork({ slug: "a", data: { title: "作品A" } }), fakeWork({ slug: "b", data: { title: "作品B" } })] },
    });
    expect(h).toContain("hero-dots");
    expect(h).toContain("作品A");
    expect(h).toContain("作品B");
  });
});
