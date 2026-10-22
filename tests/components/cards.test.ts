import { beforeAll, describe, expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import WorkCard from "../../src/components/WorkCard.astro";
import PostCard from "../../src/components/PostCard.astro";
import YouTube from "../../src/components/YouTube.astro";
import Breadcrumb from "../../src/components/Breadcrumb.astro";
import { fakePost, fakeWork } from "../helpers/fixtures";

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("WorkCard", () => {
  test("app shows pages badge and link", async () => {
    const html = await container.renderToString(WorkCard, {
      props: {
        lang: "ja",
        work: fakeWork({ slug: "simplepages", type: "app", children: [fakeWork({ slug: "l-timer" }), fakeWork({ slug: "weather" })] }),
      },
    });
    expect(html).toContain('href="/works/simplepages/"');
    expect(html).toContain("2 ページ");
    expect(html).toContain("App");
  });
});

describe("PostCard", () => {
  test("untranslated badge on en", async () => {
    const html = await container.renderToString(PostCard, {
      props: { lang: "en", post: fakePost({ translated: false, category: "car/maintenance" }) },
    });
    expect(html).toContain("Japanese");
    expect(html).toContain("Car / Maintenance");
    expect(html).toContain('data-category="car"');
  });
  test("ja has no badge", async () => {
    const html = await container.renderToString(PostCard, {
      props: { lang: "ja", post: fakePost({ translated: false, category: "car/maintenance" }) },
    });
    expect(html).not.toContain("日本語");
    expect(html).toContain("車 / メンテナンス");
  });
});

describe("YouTube", () => {
  test("renders thumbnail button", async () => {
    const html = await container.renderToString(YouTube, { props: { id: "abc123", title: "デモ" } });
    expect(html).toContain("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
    expect(html).toContain('data-id="abc123"');
  });
});

describe("Breadcrumb", () => {
  test("last item is current page, earlier are links", async () => {
    const html = await container.renderToString(Breadcrumb, {
      props: { items: [{ label: "Home", href: "/" }, { label: "Works", href: "/works/" }, { label: "Now" }] },
    });
    expect(html).toMatch(/<a href="\/"[^>]*>Home<\/a>/);
    expect(html).toMatch(/<a href="\/works\/"[^>]*>Works<\/a>/);
    expect(html).toMatch(/aria-current="page"[^>]*>Now</);
    expect(html.match(/aria-current/g)).toHaveLength(1);
  });
});
