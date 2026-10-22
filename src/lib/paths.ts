import type { Lang } from "../data/categories";
import { getAllWorks } from "./works";

export async function workPaths(lang: Lang) {
  return (await getAllWorks(lang)).map((w) => ({ params: { slug: w.slug }, props: { work: w } }));
}
