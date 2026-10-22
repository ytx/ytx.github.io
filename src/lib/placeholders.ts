import type { ImageMetadata } from "astro";
import fallback from "../assets/post-placeholder.png";

const modules = import.meta.glob<ImageMetadata>("../assets/placeholders/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

const pool: ImageMetadata[] = Object.keys(modules)
  .sort()
  .map((path) => modules[path]);

// FNV-1a (32bit)
function hash(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function pickFrom<T>(items: T[], key: string, empty: T): T {
  if (items.length === 0) return empty;
  return items[hash(key) % items.length];
}

export function pickPlaceholder(key: string): ImageMetadata {
  return pickFrom(pool, key, fallback);
}

export function placeholderCount(): number {
  return pool.length;
}
