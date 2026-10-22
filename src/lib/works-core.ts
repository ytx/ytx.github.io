import type { ImageMetadata } from "astro";
import type { Lang } from "../data/categories";
import { parseId } from "./ids";
import { pairByLang, type Localized } from "./pair";

export type WorkData = {
  title: string;
  summary: string;
  type?: "app" | "web";
  url?: string;
  repo?: string;
  thumbnail?: ImageMetadata;
  screenshots?: ImageMetadata[];
  youtube?: string;
  featured?: boolean;
  order?: number;
  parent?: string;
  tags?: string[];
  published?: Date;
};

export type Work = Localized<WorkData> & { children: Work[]; parentSlug?: string };

type Entry = { id: string; data: WorkData; entry?: unknown };

const REQUIRED_JA = ["title", "summary", "thumbnail", "url", "type"] as const;

function compareWorks(a: Work, b: Work): number {
  const ao = a.data.order ?? Infinity;
  const bo = b.data.order ?? Infinity;
  if (ao !== bo) return ao < bo ? -1 : 1;
  return (b.data.published?.getTime() ?? 0) - (a.data.published?.getTime() ?? 0);
}

/** 純粋: コレクションのエントリから作品の一覧を組み立て、整合性を検証する。 */
export function buildWorks(
  entries: Entry[],
  lang: Lang,
): { all: Work[]; parents: Work[]; featured: Work[] } {
  for (const e of entries) {
    const { slug, lang: l } = parseId(e.id);
    if (l !== "ja") continue;
    for (const key of REQUIRED_JA) {
      if (e.data[key] === undefined || e.data[key] === "") {
        throw new Error(`works/${slug}: missing required field "${key}" on the ja version`);
      }
    }
  }

  const all: Work[] = pairByLang(entries, lang, (base, override) => ({ ...base, ...override })).map((p) => ({
    ...p,
    children: [],
    parentSlug: p.data.parent,
  }));
  const bySlug = new Map(all.map((w) => [w.slug, w]));

  for (const w of all) {
    if (!w.parentSlug) continue;
    const parent = bySlug.get(w.parentSlug);
    if (!parent) throw new Error(`works/${w.slug}: parent "${w.parentSlug}" does not exist`);
    if (parent.parentSlug) {
      throw new Error(`works/${w.slug}: grandchild is not allowed ("${parent.slug}" already has a parent)`);
    }
    parent.children.push(w);
  }

  all.sort(compareWorks);
  for (const w of all) w.children.sort(compareWorks);
  const parents = all.filter((w) => !w.parentSlug);
  const featured = parents.filter((w) => w.data.featured);
  return { all, parents, featured: featured.length > 0 ? featured : parents.slice(0, 1) };
}
