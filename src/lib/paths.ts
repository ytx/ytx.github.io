import { childrenOf, parents, type Lang } from "../data/categories";
import { assertNoSlugCollision, filterByCategory, getPosts } from "./posts";
import { getAllWorks } from "./works";

export async function workPaths(lang: Lang) {
  return (await getAllWorks(lang)).map((w) => ({ params: { slug: w.slug }, props: { work: w } }));
}

export async function blogPaths(lang: Lang) {
  const posts = await getPosts(lang);
  assertNoSlugCollision(posts);
  const categories = parents().flatMap((p) => [
    {
      params: { path: p.slug },
      props: { kind: "category" as const, parent: p.slug, child: undefined, posts: filterByCategory(posts, p.slug) },
    },
    ...childrenOf(p.slug).map((c) => ({
      params: { path: `${p.slug}/${c.slug}` },
      props: {
        kind: "category" as const,
        parent: p.slug,
        child: c.slug,
        posts: filterByCategory(posts, p.slug, c.slug),
      },
    })),
  ]);
  const entries = posts.map((post) => ({
    params: { path: `${post.data.category}/${post.slug}` },
    props: {
      kind: "post" as const,
      post,
      related: posts
        .filter((p) => p !== post && p.category.parent === post.category.parent)
        .slice(0, 3),
    },
  }));
  return [...categories, ...entries];
}
