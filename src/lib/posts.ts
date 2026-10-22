import { getCollection } from "astro:content";
import type { Lang } from "../data/categories";
import { assertNoSlugCollision, assertWorkRefs, buildPosts, type Post } from "./posts-core";
import { getAllWorks } from "./works";

export {
  assertNoSlugCollision,
  assertWorkRefs,
  buildPosts,
  filterByCategory,
  latestPerParent,
  type Post,
  type PostData,
} from "./posts-core";

/** published 降順。build 時は draft 除外。 */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const entries = await getCollection("blog");
  const posts = buildPosts(entries, lang, { excludeDrafts: import.meta.env.PROD });
  assertNoSlugCollision(posts);
  assertWorkRefs(posts, (await getAllWorks("ja")).map((w) => w.slug));
  return posts;
}

export async function getPost(lang: Lang, slug: string): Promise<Post | undefined> {
  return (await getPosts(lang)).find((p) => p.slug === slug);
}

export async function postsForWork(lang: Lang, workSlug: string): Promise<Post[]> {
  return (await getPosts(lang)).filter((p) => p.data.work === workSlug);
}
