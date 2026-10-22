import { getCollection } from "astro:content";
import type { Lang } from "../data/categories";
import { buildWorks, type Work } from "./works-core";

export { buildWorks, type Work, type WorkData } from "./works-core";

async function load(lang: Lang) {
  const entries = await getCollection("works");
  return buildWorks(entries, lang);
}

/** 親のみ。children を詰めて order → published 降順。 */
export async function getWorks(lang: Lang): Promise<Work[]> {
  return (await load(lang)).parents;
}

/** 親子すべて（作品ページ生成用）。 */
export async function getAllWorks(lang: Lang): Promise<Work[]> {
  return (await load(lang)).all;
}

export async function getWork(lang: Lang, slug: string): Promise<Work | undefined> {
  return (await load(lang)).all.find((w) => w.slug === slug);
}

/** featured 全件。無ければ先頭 1 件。 */
export async function getFeaturedWorks(lang: Lang): Promise<Work[]> {
  return (await load(lang)).featured;
}
