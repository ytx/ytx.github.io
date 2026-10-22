import thumb from "../fixtures/thumb.png";
import { parseCategoryPath } from "../../src/data/categories";
import type { Work, WorkData } from "../../src/lib/works-core";
import type { Post, PostData } from "../../src/lib/posts-core";

type WorkOverrides = Partial<Omit<Work, "data">> & { type?: WorkData["type"]; data?: Partial<WorkData> };

export function fakeWork(o: WorkOverrides = {}): Work {
  const { type, data, ...rest } = o;
  return {
    slug: "sample",
    lang: "ja",
    translated: true,
    entry: undefined,
    children: [],
    data: { title: "サンプル作品", summary: "作品の説明です。", type: type ?? "web", thumbnail: thumb, ...data },
    ...rest,
  };
}

type PostOverrides = Partial<Omit<Post, "data" | "category">> & { category?: string; data?: Partial<PostData> };

export function fakePost(o: PostOverrides = {}): Post {
  const { category = "gadget", data, ...rest } = o;
  const path = parseCategoryPath(category);
  if (!path) throw new Error(`bad category ${category}`);
  return {
    slug: "sample-post",
    lang: "ja",
    translated: true,
    entry: undefined,
    ...rest,
    category: path,
    data: {
      title: "サンプル記事",
      description: "記事の説明です。",
      category,
      thumbnail: thumb,
      published: new Date("2026-01-15T00:00:00Z"),
      draft: false,
      ...data,
    },
  };
}
