import type { Lang } from "../data/categories";

export function localePrefix(lang: Lang): string {
  return lang === "ja" ? "" : "/en";
}

export function homeUrl(lang: Lang): string {
  return `${localePrefix(lang)}/`;
}

export function worksUrl(lang: Lang): string {
  return `${localePrefix(lang)}/works/`;
}

export function workUrl(lang: Lang, slug: string): string {
  return `${worksUrl(lang)}${slug}/`;
}

export function blogUrl(lang: Lang): string {
  return `${localePrefix(lang)}/blog/`;
}

export function categoryUrl(lang: Lang, path: string): string {
  return `${blogUrl(lang)}${path}/`;
}

export function postUrl(lang: Lang, categoryPath: string, slug: string): string {
  return `${categoryUrl(lang, categoryPath)}${slug}/`;
}

export function aboutUrl(lang: Lang): string {
  return `${localePrefix(lang)}/about/`;
}

export function rssUrl(lang: Lang): string {
  return `${localePrefix(lang)}/rss.xml`;
}
