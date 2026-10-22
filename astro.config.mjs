import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ytx.github.io",
  trailingSlash: "always",
  i18n: { locales: ["ja", "en"], defaultLocale: "ja" },
  integrations: [
    sitemap({
      i18n: { defaultLocale: "ja", locales: { ja: "ja", en: "en" } },
    }),
  ],
  fonts: [
    {
      name: "Zen Maru Gothic",
      cssVariable: "--font-zen-maru",
      provider: fontProviders.google(),
      weights: [400, 500, 700],
      styles: ["normal"],
      fallbacks: ["Hiragino Maru Gothic ProN", "Hiragino Sans", "Noto Sans JP", "sans-serif"],
    },
  ],
  markdown: { shikiConfig: { theme: "github-light" } },
});
