import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import type { Lang } from "../data/categories";
import { t } from "../i18n";
import { getPosts } from "./posts";
import { postUrl } from "./urls";

export async function feed(context: APIContext, lang: Lang) {
  const posts = await getPosts(lang);
  return rss({
    title: "ytx",
    description: t(lang, "blog.sub"),
    site: context.site!,
    items: posts.map(({ data, slug }) => ({
      title: data.title,
      pubDate: data.published,
      description: data.description,
      link: postUrl(lang, data.category, slug),
    })),
    customData: `<language>${lang}</language>`,
  });
}
