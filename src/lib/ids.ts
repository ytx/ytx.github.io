import type { Lang } from "../data/categories";

/** コレクション id から slug と言語を取り出す。`green/index.en` / `oil-change.en` は en、それ以外は ja。 */
export function parseId(id: string): { slug: string; lang: Lang } {
  const lang: Lang = id.endsWith(".en") ? "en" : "ja";
  const base = lang === "en" ? id.slice(0, -".en".length) : id;
  const slug = base.endsWith("/index") ? base.slice(0, -"/index".length) : base;
  return { slug, lang };
}
