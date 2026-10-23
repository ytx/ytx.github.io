import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { isValidCategoryPath } from "./data/categories";
import { WORK_ACCESS, WORK_TYPES } from "./lib/works-core";

const loader = (base: string) =>
  glob({ pattern: "**/*.md", base, generateId: ({ entry }) => entry.replace(/\.md$/, "") });

const works = defineCollection({
  loader: loader("./src/content/works"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      type: z.enum(WORK_TYPES).optional(),
      access: z.enum(WORK_ACCESS).optional(),
      url: z.url().optional(),
      repo: z.url().optional(),
      thumbnail: image().optional(),
      screenshots: z.array(image()).optional(),
      youtube: z.string().optional(),
      featured: z.boolean().optional(),
      order: z.number().optional(),
      parent: z.string().optional(),
      tags: z.array(z.string()).optional(),
      published: z.coerce.date().optional(),
    }),
});

const blog = defineCollection({
  loader: loader("./src/content/blog"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string().refine(isValidCategoryPath, { error: "unknown category" }),
      work: z.string().optional(),
      thumbnail: image().optional(),
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

const pages = defineCollection({
  loader: loader("./src/content/pages"),
  schema: z.object({ title: z.string() }),
});

export const collections = { works, blog, pages };
