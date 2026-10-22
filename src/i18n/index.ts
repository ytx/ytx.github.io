import type { Lang } from "../data/categories";
import { ja } from "./ja";
import { en } from "./en";

export type { Lang } from "../data/categories";

export const LANGS: Lang[] = ["ja", "en"];
export const DEFAULT_LANG: Lang = "ja";
export const SHOW_UNTRANSLATED = true;

type Key = keyof typeof ja;

const dictionaries: Record<Lang, Record<Key, string>> = { ja, en };

export function t(lang: Lang, key: Key): string {
  return dictionaries[lang][key];
}

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(date: Date, lang: Lang): string {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  if (lang === "ja") {
    return `${y}.${String(m + 1).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
  }
  return `${EN_MONTHS[m]} ${d}, ${y}`;
}

export function otherLang(lang: Lang): Lang {
  return lang === "ja" ? "en" : "ja";
}
