import type { ImageMetadata } from "astro";
import type { Lang } from "../data/categories";
import { parseId } from "./ids";
import { pairByLang, type Localized } from "./pair";

export const WORK_TYPES = ["app", "web", "desktop", "tool", "device"] as const;
export type WorkType = (typeof WORK_TYPES)[number];

/** 作品ページの主ボタンの種類。try / visit / download は url、source は repo へ飛ぶ。contact はメール。 */
export const WORK_ACCESS = ["try", "visit", "download", "source", "contact"] as const;
export type WorkAccess = (typeof WORK_ACCESS)[number];

export type WorkData = {
  title: string;
  summary: string;
  type?: WorkType;
  access?: WorkAccess;
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

const REQUIRED_JA = ["title", "summary", "type"] as const;

export type PrimaryAction = { kind: WorkAccess; href?: string };

/** 純粋: 作品の主ボタン。access を省くと type から決める（app は try、それ以外は visit）。 */
export function primaryAction(data: WorkData): PrimaryAction {
  const kind = data.access ?? (data.type === "app" ? "try" : "visit");
  if (kind === "contact") return { kind };
  return { kind, href: kind === "source" ? data.repo : data.url };
}

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
  const jaSlugs = new Set(entries.map((e) => parseId(e.id)).filter((x) => x.lang === "ja").map((x) => x.slug));
  for (const e of entries) {
    const { slug, lang: l } = parseId(e.id);
    if (l === "en" && !jaSlugs.has(slug)) throw new Error(`missing ja version of work "${slug}" (works/${slug}/index.md)`);
    if (l !== "ja") continue;
    for (const key of REQUIRED_JA) {
      if (e.data[key] === undefined || e.data[key] === "") {
        throw new Error(`works/${slug}: missing required field "${key}" on the ja version`);
      }
    }
    const action = primaryAction(e.data);
    if (action.kind !== "contact" && !action.href) {
      const field = action.kind === "source" ? "repo" : "url";
      throw new Error(`works/${slug}: access "${action.kind}" needs "${field}" on the ja version`);
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
  // 子作品は親のすぐあとに並べる（子どうしの order が親の order と混ざらないように）
  const featured = parents.flatMap((p) => [p, ...p.children]).filter((w) => w.data.featured);
  return { all, parents, featured: featured.length > 0 ? featured : parents.slice(0, 1) };
}
