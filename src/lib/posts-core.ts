import type { ImageMetadata } from "astro";
import { childrenOf, parseCategoryPath, type Lang } from "../data/categories";
import { pairByLang, type Localized } from "./pair";

export type PostData = {
  title: string;
  description: string;
  category: string;
  work?: string;
  thumbnail?: ImageMetadata;
  published: Date;
  updated?: Date;
  draft: boolean;
};

export type Post = Localized<PostData> & { category: { parent: string; child?: string } };

/** 純粋: published 降順の記事一覧。excludeDrafts なら draft を除く。 */
export function buildPosts(
  entries: { id: string; data: PostData; entry?: unknown }[],
  lang: Lang,
  opts: { excludeDrafts: boolean },
): Post[] {
  return pairByLang(entries, lang)
    .filter((p) => !(opts.excludeDrafts && p.data.draft))
    .map((p) => {
      const category = parseCategoryPath(p.data.category);
      if (!category) throw new Error(`blog/${p.slug}: unknown category "${p.data.category}"`);
      return { ...p, category };
    })
    .sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

/** 親指定は子カテゴリの記事を含む。入力順を保つ。 */
export function filterByCategory(posts: Post[], parent: string, child?: string): Post[] {
  return posts.filter((p) => p.category.parent === parent && (child === undefined || p.category.child === child));
}

/** 親カテゴリごとの最新 n 件。記事 0 件の親はキーを持たない。 */
export function latestPerParent(posts: Post[], n: number): Record<string, Post[]> {
  const result: Record<string, Post[]> = {};
  for (const p of posts) {
    const list = (result[p.category.parent] ??= []);
    if (list.length < n) list.push(p);
  }
  return result;
}

/** 記事 slug が同じ親の子カテゴリ slug と同じなら URL が衝突するので throw。 */
export function assertNoSlugCollision(posts: Post[]): void {
  for (const p of posts) {
    if (childrenOf(p.category.parent).some((c) => c.slug === p.slug)) {
      throw new Error(`blog/${p.slug}: slug collision with child category "${p.slug}" of "${p.category.parent}"`);
    }
  }
}

/** work: が存在しない作品 slug を指していたら throw。 */
export function assertWorkRefs(posts: Post[], workSlugs: string[]): void {
  for (const p of posts) {
    if (p.data.work !== undefined && !workSlugs.includes(p.data.work)) {
      throw new Error(`blog/${p.slug}: work "${p.data.work}" does not exist`);
    }
  }
}
