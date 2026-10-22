export type Lang = "ja" | "en";
export type Category = { slug: string; parent?: string; name: Record<Lang, string>; color: string };

export const CATEGORIES: Category[] = [
  { slug: "gadget", name: { ja: "ガジェット", en: "Gadget" }, color: "#e4e7cf" },
  { slug: "car", name: { ja: "車", en: "Car" }, color: "#dbe8fa" },
  { slug: "maintenance", parent: "car", name: { ja: "メンテナンス", en: "Maintenance" }, color: "#dbe8fa" },
  { slug: "travel", name: { ja: "旅行", en: "Travel" }, color: "#fbe3d3" },
  { slug: "diy", name: { ja: "DIY", en: "DIY" }, color: "#f8ecc9" },
  { slug: "howto", name: { ja: "使い方", en: "How-to" }, color: "#f3e3ee" },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function parents(): Category[] {
  return CATEGORIES.filter((c) => !c.parent);
}

export function childrenOf(parent: string): Category[] {
  return CATEGORIES.filter((c) => c.parent === parent);
}

export function parseCategoryPath(path: string): { parent: string; child?: string } | null {
  const segments = path.split("/");
  if (segments.length > 2 || segments.some((s) => s === "")) return null;
  const [parent, child] = segments;
  const p = getCategory(parent);
  if (!p || p.parent) return null;
  if (child === undefined) return { parent };
  const c = getCategory(child);
  if (!c || c.parent !== parent) return null;
  return { parent, child };
}

export function isValidCategoryPath(path: string): boolean {
  return parseCategoryPath(path) !== null;
}

export function categoryName(slug: string, lang: Lang): string {
  return getCategory(slug)?.name[lang] ?? slug;
}
