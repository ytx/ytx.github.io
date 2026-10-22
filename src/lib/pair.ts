import type { Lang } from "../data/categories";
import { parseId } from "./ids";

export type Localized<T> = { slug: string; lang: Lang; data: T; translated: boolean; entry: unknown };

type Item<T> = { id: string; data: T; entry?: unknown };

/**
 * 日英の版を slug ごとにまとめ、lang の版があればそれ（translated: true）、
 * 無ければもう一方の版（translated: false）を返す。並びは最初に現れた slug の順。
 * merge を渡すと、en の版を日本語側の上に重ねる（英語側に無い項目を引き継ぐ）。
 */
export function pairByLang<T>(
  items: Item<T>[],
  lang: Lang,
  merge?: (base: T, override: T) => T,
): Localized<T>[] {
  const groups = new Map<string, Partial<Record<Lang, Item<T>>>>();
  for (const item of items) {
    const { slug, lang: l } = parseId(item.id);
    const g = groups.get(slug) ?? {};
    g[l] = item;
    groups.set(slug, g);
  }
  const result: Localized<T>[] = [];
  for (const [slug, g] of groups) {
    const picked = g[lang];
    const chosenLang: Lang = picked ? lang : lang === "ja" ? "en" : "ja";
    const chosen = (picked ?? g[chosenLang])!;
    let data = chosen.data;
    if (merge && chosenLang === "en" && g.ja) data = merge(g.ja.data, chosen.data);
    result.push({ slug, lang: chosenLang, data, translated: picked !== undefined, entry: chosen.entry });
  }
  return result;
}
