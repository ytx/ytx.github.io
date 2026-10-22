import { beforeAll, describe, expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Header from "../../src/components/Header.astro";
import Footer from "../../src/components/Footer.astro";
import SectionHead from "../../src/components/SectionHead.astro";
import Base from "../../src/layouts/Base.astro";

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("Header", () => {
  test("has nav and lang switch (ja)", async () => {
    const html = await container.renderToString(Header, { props: { lang: "ja", alternate: "/en/" } });
    expect(html).toContain('href="/works/"');
    expect(html).toContain('href="/blog/"');
    expect(html).toContain('href="/about/"');
    expect(html).toContain('href="/en/"');
    expect(html).toContain(">EN<");
  });
  test("en", async () => {
    const html = await container.renderToString(Header, { props: { lang: "en", alternate: "/" } });
    expect(html).toContain('href="/en/blog/"');
    expect(html).toContain("日本語");
  });
});

describe("Footer / SectionHead", () => {
  test("footer renders copyright", async () => {
    const html = await container.renderToString(Footer, { props: { lang: "ja" } });
    expect(html).toContain("<footer");
    expect(html).toContain("© ytx");
  });
  test("SectionHead renders more link", async () => {
    const html = await container.renderToString(SectionHead, {
      props: { title: "作品", moreHref: "/works/", moreLabel: "すべて見る" },
    });
    expect(html).toContain("作品");
    expect(html).toContain('href="/works/"');
    expect(html).toContain("すべて見る");
  });
});

describe("Base", () => {
  test("head has hreflang, rss, title, lang", async () => {
    const html = await container.renderToString(Base, {
      props: { lang: "ja", title: "テスト", description: "d", alternate: "/en/" },
      request: new Request("https://ytx.github.io/"),
    });
    expect(html).toContain('<html lang="ja"');
    expect(html).toContain("<title>テスト | ytx</title>");
    expect(html).toContain('rel="alternate" hreflang="ja" href="https://ytx.github.io/"');
    expect(html).toContain('rel="alternate" hreflang="en" href="https://ytx.github.io/en/"');
    expect(html).toContain('hreflang="x-default" href="https://ytx.github.io/"');
    expect(html).toContain('type="application/rss+xml" href="/rss.xml"');
    expect(html).toContain('name="description" content="d"');
  });
});
