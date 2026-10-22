import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ytx.github.io",
  trailingSlash: "always",
  i18n: { locales: ["ja", "en"], defaultLocale: "ja" },
  integrations: [
    sitemap({
      i18n: { defaultLocale: "ja", locales: { ja: "ja-JP", en: "en-US" } },
    }),
  ],
  fonts: [
    {
      name: "Zen Maru Gothic",
      cssVariable: "--font-zen-maru",
      provider: fontProviders.google(),
      weights: [400, 500, 700],
      styles: ["normal"],
    },
  ],
  markdown: { shikiConfig: { theme: "github-light" } },
});
