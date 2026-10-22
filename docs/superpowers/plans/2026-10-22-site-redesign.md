# ytx.github.io 再構成 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lume 製の現サイトを破棄し、Astro で「作品ショーケース + 日英ブログ」の静的サイトを作り、main への push で GitHub Pages に自動公開する。

**Architecture:** Astro 7 のコンテンツコレクション（`works`、`blog`、`pages`）に日本語ファイルと `.en` ファイルを対で置き、`src/lib/` の純粋関数で言語ペアの解決・カテゴリ検証を行う。ページは `src/views/` に言語を引数に取るビューとして 1 回だけ書き、`src/pages/` と `src/pages/en/` の薄いファイルから呼ぶ。見た目は CSS 変数のトークン + コンポーネント単位のスコープ CSS。

**Tech Stack:** Astro 7.4（Node 22.12+、npm）、TypeScript、`astro/zod`、`@astrojs/rss`、`@astrojs/sitemap`、Astro Fonts API（Google: Zen Maru Gothic）、Vitest（`getViteConfig` + Container API）、GitHub Actions（`withastro/action@v6`）。

**Spec:** `docs/superpowers/specs/2026-10-22-site-redesign-design.md`

## Global Constraints

- Node 22.12 以上。`package.json` の `engines.node` に `>=22.12.0`。`package-lock.json` をコミットする。
- `astro.config.mjs`: `site: "https://ytx.github.io"`、`base` なし、`trailingSlash: "always"`、`i18n: { locales: ["ja", "en"], defaultLocale: "ja" }`（`prefixDefaultLocale` は既定の false）。
- 日本語 URL は `/...`、英語は `/en/...`。同じ構造。
- デザイントークン（spec §8.1）: 背景 `#fff9f2`、カード面 `#ffffff`、文字 `#4a3f36`、アクセント `#c9744f`、芥子 `#e6c35c`、淡緑 `#e4e7cf`、キャッチ背景 `linear-gradient(135deg, #fbe3d3, #f8ecc9)`、角丸 12〜16px / pill 999px、影 `0 1px 4px rgba(0,0,0,.05)`、本文最大幅 720px、行間 1.8。フォントは全て Zen Maru Gothic（weights 400/500/700）。
- 禁止（spec §8.2）: ダーク背景、角ばった枠、濃いグラデーション、見出し片側の太い色帯、絵文字多用、派手なアニメーション。
- 画像枠は 16:9。動画は YouTube 埋め込みのみ。リポジトリに動画を入れない。
- `category` が未定義の slug、`parent` が存在しない slug、`work` が存在しない slug はビルド失敗。
- `draft: true` の記事は `astro build` から除外、`astro dev` では表示。
- 英語版が無い記事・作品は英語サイトで隠さず、「日本語」バッジ + 断り書きで日本語本文を出す。切替は `src/i18n/index.ts` の `SHOW_UNTRANSLATED = true` 1 箇所。
- 言語の自動判定はしない。
- コミットメッセージは日本語の短い要約。末尾に `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`。

## Review Focus

- 記事の slug が同じ親カテゴリの子カテゴリ slug と同じ（例: `category: car` の記事 `maintenance.md`）→ `/blog/car/maintenance/` が二重定義になる。ビルドを失敗させる（Task 3 のテスト）。
- 英語サイトで英語版が無い記事を開く → 404 ではなく日本語本文 + 断り書き、`<html lang="ja">`（Task 7 のテスト）。
- `featured: true` の作品が 0 件 → キャッチは `order` 先頭の作品を 1 件出す。空にしない（Task 8 のテスト）。
- 記事が 0 件の親カテゴリ → トップのピルを出さない。カテゴリページ自体は「まだ記事がありません」で生成（Task 7, 8 のテスト）。
- `type: app` と `type: web` でボタン文言が変わる（「使ってみる」/「サイトを見る」、英語は "Try it" / "Visit site"）。混在させない（Task 5 のテスト）。

---

## ファイル構成

```
.
├── .github/workflows/deploy.yml
├── astro.config.mjs
├── package.json / package-lock.json / tsconfig.json / vitest.config.ts
├── public/favicon.svg
├── src/
│   ├── content.config.ts            # 3 コレクション: works, blog, pages
│   ├── content/
│   │   ├── works/<slug>/index.md, index.en.md, *.png
│   │   ├── blog/<slug>.md, <slug>.en.md
│   │   └── pages/about.md, about.en.md
│   ├── data/categories.ts           # カテゴリ定義 + 検証関数
│   ├── i18n/{index.ts, ja.ts, en.ts}
│   ├── lib/
│   │   ├── ids.ts                   # エントリ id → {slug, lang}
│   │   ├── pair.ts                  # 日英ペア解決（純粋関数）
│   │   ├── works.ts                 # getWorks / 親子 / featured（astro:content 依存）
│   │   ├── posts.ts                 # getPosts / カテゴリ絞り込み / 衝突検査
│   │   └── urls.ts                  # URL 生成（/en/ 付与、記事・作品・カテゴリ）
│   ├── styles/{tokens.css, global.css}
│   ├── layouts/Base.astro
│   ├── components/{Header, Footer, LangSwitch, WorkCard, PostCard, CategoryPills,
│   │                Breadcrumb, YouTube, Hero, Notice, SectionHead}.astro
│   ├── views/{Home, WorksIndex, WorkDetail, BlogIndex, Category, Post, About, NotFound}.astro
│   └── pages/
│       ├── index.astro, 404.astro, about.astro, rss.xml.ts
│       ├── works/index.astro, works/[slug].astro
│       ├── blog/index.astro, blog/[...path].astro
│       └── en/ (同じ構成。各ファイルは views を lang="en" で呼ぶだけ)
└── tests/
    ├── unit/*.test.ts               # 純粋関数
    ├── components/*.test.ts         # Container API
    └── build/*.test.ts              # dist/ を読む（npm run test:build）
```

---

### Task 1: 旧サイトの撤去と Astro の土台

**Files:**
- Delete: `_config.ts`, `_cms.ts`, `_data.yml`, `_includes/`, `deno.json`, `styles.css`, `f/`, `s/`, `index.md`, `.github/workflows/lume.yml`
- Create: `package.json`, `tsconfig.json`, `astro.config.mjs`, `vitest.config.ts`, `src/pages/index.astro`（仮）, `public/favicon.svg`, `.github/workflows/deploy.yml`, `tests/unit/smoke.test.ts`
- Modify: `.gitignore`, `README.md`

**Interfaces:**
- Produces: `npm run dev` / `build` / `test` / `test:build` が動く土台。

- [ ] **Step 1: 旧ファイルを削除し、.gitignore を更新**

`git rm -r` で上記 Delete 一覧を消す。`.gitignore` を `node_modules/`, `dist/`, `.astro/`, `.DS_Store`, `.superpowers/` にする。

- [ ] **Step 2: package.json を作る**

```json
{
  "name": "ytx.github.io", "private": true, "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev", "build": "astro build", "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run --exclude tests/build",
    "test:build": "astro build && vitest run tests/build"
  }
}
```
`npm install astro@^7.4 @astrojs/rss @astrojs/sitemap` と `npm install -D vitest @astrojs/check typescript` を実行。

- [ ] **Step 3: astro.config.mjs を Global Constraints の値で書く**

`defineConfig` に `site`, `trailingSlash: "always"`, `i18n`, `integrations: [sitemap({ i18n: { defaultLocale: "ja", locales: { ja: "ja-JP", en: "en-US" } } })]`, `fonts: [{ name: "Zen Maru Gothic", cssVariable: "--font-zen-maru", provider: fontProviders.google(), weights: [400, 500, 700], styles: ["normal"] }]`, `markdown: { shikiConfig: { theme: "github-light" } }`。

`tsconfig.json` は `{ "extends": "astro/tsconfigs/strict" }`。`vitest.config.ts` は docs 通り `getViteConfig({ test: {} })`。

- [ ] **Step 4: 仮トップと smoke テストを書く**

`src/pages/index.astro` は `<html lang="ja"><body><h1>ytx</h1></body></html>`。
`tests/unit/smoke.test.ts`:
```ts
import { expect, test } from "vitest";
test("vitest runs", () => { expect(1 + 1).toBe(2); });
```

- [ ] **Step 5: 動作確認**

Run: `npm run test` → Expected: 1 passed。
Run: `npm run build` → Expected: `dist/index.html` が生成される。

- [ ] **Step 6: デプロイ workflow を書く**

`.github/workflows/deploy.yml` は Astro 公式の GitHub Pages 手順そのまま（`on: push: branches: [main]` + `workflow_dispatch`、`permissions: contents: read / pages: write / id-token: write`、build job に `actions/checkout@v7` と `withastro/action@v6`、deploy job に `actions/deploy-pages@v5`、`environment: github-pages`）。

- [ ] **Step 7: README を書き換えてコミット**

README: サイトの目的 1 行、`npm run dev` / `build` / `test` / `test:build`、記事と作品の追加方法は Task 3 完了後に追記する旨。
```bash
git add -A && git commit -m "Astro に土台を作り直し、Lume 構成を撤去"
```

---

### Task 2: カテゴリ定義と検証

**Files:**
- Create: `src/data/categories.ts`, `tests/unit/categories.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type Lang = "ja" | "en";
  export type Category = { slug: string; parent?: string; name: Record<Lang, string>; color: string };
  export const CATEGORIES: Category[];           // spec §5.3 の 5 親 + car/maintenance
  export function parseCategoryPath(path: string): { parent: string; child?: string } | null;
                                                  // "car/maintenance" → {parent:"car", child:"maintenance"}; 未定義 → null
  export function isValidCategoryPath(path: string): boolean;
  export function getCategory(slug: string): Category | undefined;
  export function childrenOf(parent: string): Category[];
  export function parents(): Category[];
  export function categoryName(slug: string, lang: Lang): string;
  ```
- 初期値: gadget(ガジェット/Gadget, `#e4e7cf`), car(車/Car, `#dbe8fa`), maintenance(parent car, メンテナンス/Maintenance), travel(旅行/Travel, `#fbe3d3`), diy(DIY/DIY, `#f8ecc9`), howto(使い方/How-to, `#f3e3ee`)。子の color は親と同じ。

- [ ] **Step 1: テストを書く**

```ts
test("parses parent/child", () => expect(parseCategoryPath("car/maintenance")).toEqual({ parent: "car", child: "maintenance" }));
test("parses parent only", () => expect(parseCategoryPath("car")).toEqual({ parent: "car" }));
test("rejects unknown parent", () => expect(parseCategoryPath("food")).toBeNull());
test("rejects child under wrong parent", () => expect(parseCategoryPath("travel/maintenance")).toBeNull());
test("rejects 3 levels", () => expect(parseCategoryPath("car/maintenance/oil")).toBeNull());
test("names both languages", () => { expect(categoryName("car", "ja")).toBe("車"); expect(categoryName("car", "en")).toBe("Car"); });
test("childrenOf", () => expect(childrenOf("car").map(c => c.slug)).toEqual(["maintenance"]));
test("parents excludes children", () => expect(parents().map(c => c.slug)).toEqual(["gadget", "car", "travel", "diy", "howto"]));
```

- [ ] **Step 2: 失敗を確認** — Run: `npx vitest run tests/unit/categories.test.ts` → FAIL（module not found）
- [ ] **Step 3: 実装** — `src/data/categories.ts` に上記インターフェース。
- [ ] **Step 4: 成功を確認** — 同コマンド → 8 passed
- [ ] **Step 5: Commit** — `git commit -m "カテゴリ定義と検証を追加"`

---

### Task 3: i18n 辞書と URL ヘルパー

**Files:**
- Create: `src/i18n/index.ts`, `src/i18n/ja.ts`, `src/i18n/en.ts`, `src/lib/urls.ts`, `tests/unit/i18n.test.ts`, `tests/unit/urls.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/i18n/index.ts
  export type Lang = "ja" | "en";   // Task 2 の Lang を再エクスポート
  export const LANGS: Lang[] = ["ja", "en"];
  export const DEFAULT_LANG: Lang = "ja";
  export const SHOW_UNTRANSLATED = true;
  export function t(lang: Lang, key: keyof typeof ja): string;
  export function formatDate(date: Date, lang: Lang): string;  // ja: "2026.10.22", en: "Oct 22, 2026"
  export function otherLang(lang: Lang): Lang;
  // src/lib/urls.ts
  export function localePrefix(lang: Lang): string;             // ja: "", en: "/en"
  export function homeUrl(lang): string;                        // "/" | "/en/"
  export function worksUrl(lang): string;                       // "/works/" | "/en/works/"
  export function workUrl(lang, slug): string;                  // "/works/green/"
  export function blogUrl(lang): string;
  export function categoryUrl(lang, path): string;              // "/blog/car/maintenance/"
  export function postUrl(lang, categoryPath, slug): string;    // "/blog/car/maintenance/<slug>/"
  export function aboutUrl(lang): string;
  export function rssUrl(lang): string;                         // "/rss.xml" | "/en/rss.xml"
  ```
- 辞書キー（両言語に同じキー）: `siteName`("ytx"), `nav.works`, `nav.blog`, `nav.about`, `hero.tryIt`("使ってみる"/"Try it"), `hero.visit`("サイトを見る"/"Visit site"), `hero.detail`("くわしく"/"Details"), `works.title`("Works"), `works.sub`("作ったもの"/"Things I made"), `works.all`("すべての作品"/"All works"), `works.pages`("{n} ページ"/"{n} pages"), `blog.title`("Blog"), `blog.sub`("最近の記事"/"Recent posts"), `blog.all`("記事一覧"/"All posts"), `blog.allPill`("すべて"/"All"), `blog.empty`("まだ記事がありません"/"No posts yet"), `blog.related`("同じカテゴリの記事"/"More in this category"), `work.howto`("使い方"/"How to use"), `work.repo`("ソースコード"/"Source"), `work.includes`("含まれるページ"/"Pages"), `untranslated.badge`("日本語"/"Japanese"), `untranslated.notice`("この記事は日本語のみです"/"This page is available in Japanese only"), `untranslatedEnOnly.notice`("この記事は英語のみです"/"This page is available in English only"), `lang.switch`("EN"/"日本語"), `notfound.title`("ページが見つかりません"/"Page not found"), `notfound.back`("トップへ戻る"/"Back to top"), `footer.copyright`("© ytx"), `breadcrumb.home`("ホーム"/"Home"), `a11y.prev`/`a11y.next`/`a11y.goto`（キャッチのボタン用）。

- [ ] **Step 1: テストを書く**

```ts
test("t returns per language", () => { expect(t("ja","hero.tryIt")).toBe("使ってみる"); expect(t("en","hero.tryIt")).toBe("Try it"); });
test("every key exists in both", () => expect(Object.keys(en).sort()).toEqual(Object.keys(ja).sort()));
test("formatDate", () => { const d = new Date("2026-10-22"); expect(formatDate(d,"ja")).toBe("2026.10.22"); expect(formatDate(d,"en")).toBe("Oct 22, 2026"); });
test("urls ja", () => { expect(postUrl("ja","car/maintenance","oil")).toBe("/blog/car/maintenance/oil/"); expect(categoryUrl("ja","car")).toBe("/blog/car/"); expect(rssUrl("ja")).toBe("/rss.xml"); });
test("urls en", () => { expect(workUrl("en","green")).toBe("/en/works/green/"); expect(homeUrl("en")).toBe("/en/"); expect(rssUrl("en")).toBe("/en/rss.xml"); });
```

- [ ] **Step 2: 失敗を確認** → FAIL
- [ ] **Step 3: 実装** — `t` は `ja`/`en` のフラットなオブジェクトから引く。`formatDate` は `Intl.DateTimeFormat` ではなく固定書式（タイムゾーン差を避けるため UTC の年月日を使う）。
- [ ] **Step 4: 成功を確認** → all passed
- [ ] **Step 5: Commit** — `git commit -m "i18n 辞書と URL ヘルパーを追加"`

---

### Task 4: コンテンツコレクションと日英ペア解決、サンプルコンテンツ

**Files:**
- Create: `src/content.config.ts`, `src/lib/ids.ts`, `src/lib/pair.ts`, `src/lib/works.ts`, `src/lib/posts.ts`, `tests/unit/ids.test.ts`, `tests/unit/pair.test.ts`, `tests/unit/posts.test.ts`
- Create (content): `src/content/works/{green,kaji0,simplepages,l-timer,weather}/index.md` と `index.en.md`、画像（`tmp/` の 4 枚を `green/thumb.png`, `kaji0/thumb.png`, `simplepages/thumb.png`（l_timer のコピー）, `l-timer/thumb.png`, `weather/thumb.png` にリネームして移動、`tmp/` を削除）。`src/content/blog/` に記事: `first-gadget.md`(gadget)、`car-intro.md`(car)、`oil-change.md`(car/maintenance)、`kyoto.md`(travel)、`simplepages-howto.md`(howto, `work: simplepages`)、`simplepages-howto.en.md`、`draft-sample.md`(gadget, `draft: true`)。`src/content/pages/about.md`, `about.en.md`。**diy には記事を置かない**（記事 0 件カテゴリの挙動をテストするため）。
- Modify: `README.md`（記事・作品の追加方法）

**Interfaces:**
- `src/content.config.ts`: 3 コレクション。glob の `generateId: ({ entry }) => entry.replace(/\.md$/, "")` で id を `green/index`, `green/index.en`, `oil-change`, `oil-change.en`, `about`, `about.en` にする。
  - works schema（`({ image }) =>`）: `title: z.string()`, `summary: z.string()`, `type: z.enum(["app","web"]).optional()`, `url: z.string().url().optional()`, `repo: z.string().url().optional()`, `thumbnail: image().optional()`, `screenshots: z.array(image()).optional()`, `youtube: z.string().optional()`, `featured: z.boolean().optional()`, `order: z.number().optional()`, `parent: z.string().optional()`, `tags: z.array(z.string()).optional()`, `published: z.coerce.date().optional()`。（英語側は title/summary のみ必須なので他は optional。日本語側の必須チェックは `works.ts` で行う。）
  - blog schema: `title`, `description: z.string()`, `category: z.string().refine(isValidCategoryPath, { error: "unknown category" })`, `work: z.string().optional()`, `thumbnail: image().optional()`, `published: z.coerce.date()`, `updated: z.coerce.date().optional()`, `draft: z.boolean().default(false)`。
  - pages schema: `title: z.string()`。
- Produces:
  ```ts
  // src/lib/ids.ts
  export function parseId(id: string): { slug: string; lang: Lang };
  // "green/index" → {green, ja}; "green/index.en" → {green, en}; "oil-change" → {oil-change, ja}; "oil-change.en" → {oil-change, en}
  // src/lib/pair.ts  (astro:content に依存しない)
  export type Localized<T> = { slug: string; lang: Lang; data: T; translated: boolean; entry: unknown };
  export function pairByLang<T>(items: { id: string; data: T; entry?: unknown }[], lang: Lang,
                                merge?: (base: T, override: T) => T): Localized<T>[];
  // lang の版があればそれ（translated: true）。無ければもう一方の版（translated: false）。
  // merge は works 用: 英語側に無い項目を日本語側から引き継ぐ。
  // src/lib/works.ts
  export type Work = Localized<WorkData> & { children: Work[]; parentSlug?: string };
  export async function getWorks(lang: Lang): Promise<Work[]>;   // 親のみ、children を詰めて order→published desc
  export async function getAllWorks(lang: Lang): Promise<Work[]>; // 親子すべて（作品ページ生成用）
  export async function getWork(lang: Lang, slug: string): Promise<Work | undefined>;
  export async function getFeaturedWorks(lang: Lang): Promise<Work[]>; // featured 全件、無ければ getWorks()[0] 1 件
  export function buildWorks(entries: { id: string; data: WorkData; entry?: unknown }[], lang: Lang): { all: Work[]; parents: Work[]; featured: Work[] }; // 純粋。get* はこれを呼ぶ
  // 日本語側に title/summary/thumbnail/url/type が無い、parent が存在しない、孫がある → throw Error
  // src/lib/posts.ts
  export type Post = Localized<PostData> & { category: { parent: string; child?: string } };
  export async function getPosts(lang: Lang): Promise<Post[]>;   // published desc、build 時は draft 除外
  export async function getPost(lang: Lang, slug: string): Promise<Post | undefined>;
  export function filterByCategory(posts: Post[], parent: string, child?: string): Post[]; // 親指定は子を含む
  export function latestPerParent(posts: Post[], n: number): Record<string, Post[]>;      // 記事 0 件の親はキー無し
  export async function postsForWork(lang: Lang, workSlug: string): Promise<Post[]>;
  export function assertNoSlugCollision(posts: Post[]): void;  // 記事 slug が同親の子カテゴリ slug と同じなら throw
  // work: が存在しない slug なら throw
  ```

- [ ] **Step 1: ids / pair / posts の純粋関数テストを書く**

```ts
// ids
expect(parseId("green/index")).toEqual({ slug: "green", lang: "ja" });
expect(parseId("green/index.en")).toEqual({ slug: "green", lang: "en" });
expect(parseId("oil-change.en")).toEqual({ slug: "oil-change", lang: "en" });
// pair
const items = [{ id: "a", data: { title: "A" } }, { id: "a.en", data: { title: "A-en" } }, { id: "b", data: { title: "B" } }];
expect(pairByLang(items, "en").map(x => [x.slug, x.data.title, x.translated])).toEqual([["a","A-en",true],["b","B",false]]);
expect(pairByLang(items, "ja").every(x => x.translated)).toBe(true);
// pair merge (works): en lacks url → inherits
const w = [{ id: "g/index", data: { title: "g", url: "https://x" } }, { id: "g/index.en", data: { title: "G" } }];
expect(pairByLang(w, "en", (b, o) => ({ ...b, ...o }))[0].data).toEqual({ title: "G", url: "https://x" });
// posts helpers (feed plain objects shaped like Post)
expect(filterByCategory(posts, "car").map(p => p.slug)).toEqual(["oil-change", "car-intro"]);  // 子を含む, published desc
expect(filterByCategory(posts, "car", "maintenance").map(p => p.slug)).toEqual(["oil-change"]);
expect(Object.keys(latestPerParent(posts, 6))).not.toContain("howto-empty");
expect(() => assertNoSlugCollision([postLike({ slug: "maintenance", category: "car" })])).toThrow(/collision/);
// works helpers (buildWorks on plain entries)
expect(buildWorks(entriesWithoutFeatured, "ja").featured.map(w => w.slug)).toEqual(["green"]);   // featured 0 件 → order 先頭 1 件
expect(() => buildWorks([...entries, entryLike({ id: "x/index", parent: "nope" })], "ja")).toThrow(/parent/);
expect(() => buildWorks([...entries, entryLike({ id: "y/index", parent: "l-timer" })], "ja")).toThrow(/grand/);
```

- [ ] **Step 2: 失敗を確認** → FAIL
- [ ] **Step 3: 実装** — `ids.ts`, `pair.ts`, `posts.ts` の純粋部分。`posts.ts` / `works.ts` の `getCollection` を使う関数は、テスト可能な純粋関数（`buildPosts(entries, lang)`, `buildWorks(entries, lang)`）に委譲し、`get*` はそれを呼ぶだけにする。draft 除外は `import.meta.env.PROD` で判定。
- [ ] **Step 4: 成功を確認** → all passed
- [ ] **Step 5: content.config.ts とサンプルコンテンツを置く**

作品の frontmatter は spec §10 の表の通り（url, type, summary 仮文）。`simplepages` に `featured: true`、`green` にも `featured: true`。`l-timer`, `weather` に `parent: simplepages`。各 `index.en.md` は title と summary と英語本文 1 段落のみ。記事は各 2〜3 段落のダミー文、`oil-change.md` にコードブロックを 1 つ入れる（ハイライト確認用）。

- [ ] **Step 6: ビルドで検証**

Run: `npm run build` → Expected: 成功。`npx astro check` → 型エラーなし。
`src/content/blog/bad.md` に `category: food` を一時的に置いて `npm run build` → Expected: FAIL（unknown category）。削除する。

- [ ] **Step 7: README に追記してコミット**

README に「作品を追加する」「記事を追加する」「英語版を追加する」「カテゴリを追加する」の 4 節（frontmatter の例 1 つずつ）。
`git commit -m "コンテンツコレクションと日英ペア解決、サンプルコンテンツを追加"`

---

### Task 5: デザイントークン、レイアウト、ヘッダー/フッター、404

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/LangSwitch.astro`, `src/components/SectionHead.astro`, `src/components/Notice.astro`, `src/views/NotFound.astro`, `src/pages/404.astro`, `src/pages/en/404.astro`, `tests/components/layout.test.ts`
- Modify: `src/pages/index.astro`（Base を使う仮トップに）

**Interfaces:**
- `Base.astro` props: `{ lang: Lang; title: string; description?: string; alternate?: string; ogImage?: string }`。`alternate` は対訳ページの絶対パス（無ければもう一方の言語のトップ）。`<html lang={lang}>`、`<title>{title} | ytx</title>`、`<link rel="alternate" hreflang="ja" href="...">` と `hreflang="en"` の 2 本（属性順はこの通り。絶対 URL）、`x-default` は ja、`<Font cssVariable="--font-zen-maru" preload />`、`<link rel="alternate" type="application/rss+xml" href={rssUrl(lang)}>`、global.css の読み込み。
- `Header.astro` props: `{ lang; alternate }` → サイト名、nav 3 つ、LangSwitch。
- `LangSwitch.astro` props: `{ lang; alternate }` → `<a href={alternate}>{t(lang,"lang.switch")}</a>`。
- `SectionHead.astro` props: `{ title; sub?; moreHref?; moreLabel? }`。
- `Notice.astro` slot のみ（淡い背景の角丸ボックス）。
- `tokens.css`: `:root` に `--bg`, `--surface`, `--text`, `--text-muted`, `--accent`, `--accent-2`(芥子), `--accent-3`(淡緑), `--hero-bg`, `--radius`(14px), `--radius-pill`, `--shadow`, `--font`(`var(--font-zen-maru), sans-serif`), `--measure`(720px)。
- `global.css`: リセット最小、`body { background: var(--bg); color: var(--text); font-family: var(--font); line-height: 1.8 }`、`.container { max-width: 1080px; margin: 0 auto; padding: 0 16px }`、`.prose { max-width: var(--measure) }` と見出し（下線や小さなマーカーで装飾。左の太い帯は禁止）、リンク色 `--accent`、`pre` の角丸と淡い背景。

- [ ] **Step 1: Container API のテストを書く**

```ts
test("Header has nav and lang switch (ja)", async () => {
  const html = await container.renderToString(Header, { props: { lang: "ja", alternate: "/en/" } });
  expect(html).toContain('href="/works/"'); expect(html).toContain('href="/en/"'); expect(html).toContain(">EN<");
});
test("Header en", async () => { const html = ...({ lang: "en", alternate: "/" }); expect(html).toContain('href="/en/blog/"'); expect(html).toContain("日本語"); });
```

- [ ] **Step 2: 失敗を確認** → FAIL
- [ ] **Step 3: 実装** — 上記ファイル。404 は NotFound ビュー（タイトルと「トップへ戻る」）。`src/pages/404.astro` は `<NotFound lang="ja" />`、`en/404.astro` は `lang="en"`。
- [ ] **Step 4: 成功を確認** → passed。`npm run build` 成功。`npm run dev` で http://localhost:4321/ を開き、クリーム地・Zen Maru Gothic・ヘッダーが出ることを目視。
- [ ] **Step 5: Commit** — `git commit -m "デザイントークンとレイアウト、ヘッダー/フッター、404 を追加"`

---

### Task 6: カード部品（WorkCard, PostCard, YouTube, Breadcrumb）

**Files:**
- Create: `src/components/WorkCard.astro`, `src/components/PostCard.astro`, `src/components/YouTube.astro`, `src/components/Breadcrumb.astro`, `tests/components/cards.test.ts`

**Interfaces:**
- `WorkCard` props: `{ lang: Lang; work: Work }` → `<a href={workUrl(lang, slug)}>` に 16:9 の `<Image width={640} height={360} />`（thumbnail）、type バッジ（"App"/"Web"）、title、summary、`children.length > 0` なら `t("works.pages")` の `{n}` 置換バッジ、`translated === false && lang !== "ja"` なら `untranslated.badge`。
- `PostCard` props: `{ lang; post: Post }` → thumbnail が無ければカテゴリ color の無地 16:9 ブロック、カテゴリバッジ（親名、子があれば「親 / 子」）、title、description、`formatDate(published)`、未翻訳バッジ。`data-category={parent}` 属性（トップのピル絞り込み用）。
- `YouTube` props: `{ id: string; title: string }` → `<lite-youtube>` 相当を自前で: サムネイル `https://i.ytimg.com/vi/{id}/hqdefault.jpg` を 16:9 で表示し、クリックで `<iframe src="https://www.youtube-nocookie.com/embed/{id}?autoplay=1">` に差し替える小さな `<script>`。
- `Breadcrumb` props: `{ items: { label: string; href?: string }[] }`。

- [ ] **Step 1: テストを書く**

```ts
test("WorkCard app shows pages badge and link", async () => {
  const html = await container.renderToString(WorkCard, { props: { lang: "ja", work: fakeWork({ slug: "simplepages", type: "app", children: [fakeWork({slug:"l-timer"}), fakeWork({slug:"weather"})] }) } });
  expect(html).toContain('href="/works/simplepages/"'); expect(html).toContain("2 ページ"); expect(html).toContain("App");
});
test("PostCard untranslated badge on en", async () => {
  const html = await container.renderToString(PostCard, { props: { lang: "en", post: fakePost({ translated: false, category: "car/maintenance" }) } });
  expect(html).toContain("Japanese"); expect(html).toContain("Car / Maintenance"); expect(html).toContain('data-category="car"');
});
test("PostCard ja has no badge", async () => { ...; expect(html).not.toContain("日本語"); });
```
`fakeWork`/`fakePost` は `tests/helpers/fixtures.ts` に置く（thumbnail は `tests/fixtures/thumb.png` を `import` した ImageMetadata）。

- [ ] **Step 2: 失敗を確認** → FAIL
- [ ] **Step 3: 実装**
- [ ] **Step 4: 成功を確認** → passed
- [ ] **Step 5: Commit** — `git commit -m "作品カード、記事カード、YouTube 埋め込み、パンくずを追加"`

---

### Task 7: 作品ページ（一覧・詳細、日英）

**Files:**
- Create: `src/views/WorksIndex.astro`, `src/views/WorkDetail.astro`, `src/pages/works/index.astro`, `src/pages/works/[slug].astro`, `src/pages/en/works/index.astro`, `src/pages/en/works/[slug].astro`, `tests/build/works.test.ts`

**Interfaces:**
- `WorksIndex` props `{ lang }` → `getWorks(lang)` の WorkCard グリッド（4 → 2 → 1 列）。
- `WorkDetail` props `{ lang; work: Work }` → Breadcrumb（Home / Works / [親] / title）、title、summary、主ボタン（type で文言切替、`url` へ）、repo リンク、`youtube` があれば YouTube、`screenshots` を 16:9 で縦積み、本文（`render(entry)`）、`children` があれば `work.includes` 見出し + WorkCard グリッド、`postsForWork` が 1 件以上なら `work.howto` 見出し + PostCard 一覧。`translated === false` なら先頭に Notice（`untranslated.notice`、ja の記事を en で見る場合。逆は `untranslatedEnOnly.notice`）、`<html lang>` は実際の本文の言語。
- `[slug].astro`: `getStaticPaths` は `getAllWorks(lang)` から `{ params: { slug }, props: { work } }`。en 版は同じコードで `lang="en"`。共通化のため `src/lib/paths.ts` に `export async function workPaths(lang)` を置く。

- [ ] **Step 1: build テストを書く**（`tests/build/` は `dist/` を `fs` で読む。`npm run test:build` で実行）

```ts
const read = (p) => fs.readFileSync(path.join("dist", p), "utf8");
test("works index lists parents only", () => { const h = read("works/index.html"); expect(h).toContain("/works/simplepages/"); expect(h).not.toContain("/works/l-timer/"); });
test("parent work shows children", () => { const h = read("works/simplepages/index.html"); expect(h).toContain("/works/l-timer/"); expect(h).toContain("使ってみる"); expect(h).toContain("/blog/howto/simplepages-howto/"); });
test("child work has breadcrumb to parent", () => expect(read("works/l-timer/index.html")).toContain('href="/works/simplepages/"'));
test("web work uses visit label", () => expect(read("works/green/index.html")).toContain("サイトを見る"));
test("en work page", () => { const h = read("en/works/green/index.html"); expect(h).toContain("Visit site"); expect(h).toContain('hreflang="ja" href="https://ytx.github.io/works/green/"'); });
```

- [ ] **Step 2: 失敗を確認** — Run: `npm run test:build` → FAIL（dist に無い）
- [ ] **Step 3: 実装**
- [ ] **Step 4: 成功を確認** — `npm run test:build` → passed。`npm run dev` で `/works/simplepages/` と `/en/works/simplepages/` を目視。
- [ ] **Step 5: Commit** — `git commit -m "作品の一覧と詳細ページを追加"`

---

### Task 8: 記事ページ（一覧・カテゴリ・記事、日英）

**Files:**
- Create: `src/views/BlogIndex.astro`, `src/views/Category.astro`, `src/views/Post.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[...path].astro`, `src/pages/en/blog/index.astro`, `src/pages/en/blog/[...path].astro`, `src/components/CategoryTree.astro`, `tests/build/blog.test.ts`
- Modify: `src/lib/paths.ts`（`blogPaths(lang)` を追加）

**Interfaces:**
- `blogPaths(lang)`: `assertNoSlugCollision(posts)` を呼んでから、(a) 親カテゴリごと `{ params: { path: "car" }, props: { kind: "category", parent, child?: undefined, posts } }`、(b) 子カテゴリごと `{ path: "car/maintenance" }`、(c) 記事ごと `{ path: "car/maintenance/oil-change", props: { kind: "post", post, related } }`。`related` は同じ親カテゴリの他記事 3 件。`[...path].astro` は `kind` で `Category` か `Post` ビューを出し分ける。
- `BlogIndex` props `{ lang }` → `CategoryTree`（親子ツリーのリンク、記事 0 件でも表示）+ 全記事 PostCard。
- `Category` props `{ lang; parent; child?; posts }` → Breadcrumb、見出し（カテゴリ名）、子カテゴリのピル（親ページのとき）、PostCard 一覧。0 件なら `blog.empty`。
- `Post` props `{ lang; post; related }` → Breadcrumb、未翻訳 Notice、`work` があれば作品へのリンクカード（title + summary + `hero.detail`）、title、日付（updated があれば併記）、カテゴリバッジ、`<article class="prose">` に本文、`blog.related` + PostCard 3 件。

- [ ] **Step 1: build テストを書く**

```ts
test("category pages exist incl. empty", () => { expect(read("blog/howto/index.html")).toContain("/blog/howto/simplepages-howto/"); expect(read("blog/diy/index.html")).toContain("まだ記事がありません"); });
test("parent category includes child posts", () => expect(read("blog/car/index.html")).toContain("/blog/car/maintenance/oil-change/"));
test("post page has breadcrumb, code highlight", () => { const h = read("blog/car/maintenance/oil-change/index.html"); expect(h).toContain('href="/blog/car/maintenance/"'); expect(h).toContain("astro-code"); });
test("draft excluded from build", () => expect(fs.existsSync("dist/blog/gadget/draft-sample/index.html")).toBe(false));
test("en untranslated post shows ja body with notice", () => { const h = read("en/blog/car/maintenance/oil-change/index.html"); expect(h).toContain("available in Japanese only"); expect(h).toContain('<html lang="ja"'); });
test("en translated post", () => { const h = read("en/blog/howto/simplepages-howto/index.html"); expect(h).not.toContain("Japanese only"); expect(h).toContain('<html lang="en"'); expect(h).toContain('href="/en/works/simplepages/"'); });
```

- [ ] **Step 2: 失敗を確認** → FAIL
- [ ] **Step 3: 実装**
- [ ] **Step 4: 成功を確認** → `npm run test:build` passed。`tests/unit/posts.test.ts` の衝突テストも引き続き通ること。
- [ ] **Step 5: Commit** — `git commit -m "記事の一覧、カテゴリ、記事ページを追加"`

---

### Task 9: トップページ（キャッチ、Works、Blog + ピル絞り込み）

**Files:**
- Create: `src/components/Hero.astro`, `src/components/CategoryPills.astro`, `src/views/Home.astro`, `src/pages/en/index.astro`, `tests/build/home.test.ts`, `tests/components/hero.test.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- `Hero` props `{ lang; works: Work[] }`（`getFeaturedWorks` の結果）→ 各作品を 1 スライド: 左 16:9 枠（youtube があれば YouTube、無ければ `<Image>`）、右に title、summary、主ボタン（type 別文言、`url` へ）、`hero.detail` リンク（作品ページへ）。背景 `--hero-bg`。2 件以上なら下にドット + 前後ボタン、`<script>` で 6 秒ごとにフェード切替（`prefers-reduced-motion: reduce` なら自動切替しない）。1 件ならドットもスクリプトも出さない。
- `CategoryPills` props `{ lang; groups: Record<string, Post[]>; all: Post[] }` → ピル「すべて」+ `Object.keys(groups)` の親のみ。各グループを `<div data-group={parent} hidden>` に PostCard で出し、ピルのクリックで表示切替（小さな `<script>`、`aria-pressed` を更新）。初期表示は「すべて」。
- `Home` props `{ lang }` → Header 下に Hero、`SectionHead(works)` + `getWorks(lang).slice(0, 8)` WorkCard グリッド + `works.all` リンク、`SectionHead(blog)` + `CategoryPills(latestPerParent(posts, 6), posts.slice(0,6))` + `blog.all` リンク。

- [ ] **Step 1: テストを書く**

```ts
// components
test("Hero with 1 work has no dots", async () => { const h = await render(Hero, { lang: "ja", works: [fakeWork()] }); expect(h).not.toContain("hero-dots"); });
test("Hero with 2 works has dots and both titles", ...);
// build
test("home shows featured, works, pills", () => { const h = read("index.html"); expect(h).toContain("simplePages"); expect(h).toContain("/works/green/"); expect(h).toContain('data-group="car"'); expect(h).not.toContain('data-group="diy"'); });
test("home en", () => { const h = read("en/index.html"); expect(h).toContain("Recent posts"); expect(h).toContain('href="/en/works/"'); });
```
（diy は Task 4 で記事 0 件にしてある。）

- [ ] **Step 2: 失敗を確認** → FAIL
- [ ] **Step 3: 実装**
- [ ] **Step 4: 成功を確認** → `npm run test` と `npm run test:build` が passed。`npm run dev` でトップ（ja/en）を目視: キャッチのフェード切替、ピルの切替、スマートフォン幅（375px）で 1 列になり横スクロールが出ないこと。
- [ ] **Step 5: Commit** — `git commit -m "トップページ（キャッチ、作品、記事の絞り込み）を追加"`

---

### Task 10: About、RSS、サイトマップ、OGP、最終確認

**Files:**
- Create: `src/views/About.astro`, `src/pages/about.astro`, `src/pages/en/about.astro`, `src/pages/rss.xml.ts`, `src/pages/en/rss.xml.ts`, `tests/build/meta.test.ts`
- Modify: `src/layouts/Base.astro`（OGP: `og:title`, `og:description`, `og:image`（指定が無ければ `/og-default.png`）、`og:locale`）, `public/og-default.png`（1200×630 のクリーム地にサイト名。生成方法は実装者に任せる）, `README.md`

**Interfaces:**
- `About` props `{ lang }` → `getEntry("pages", lang === "ja" ? "about" : "about.en")`、無ければ ja にフォールバック + Notice。`<article class="prose">`。
- `rss.xml.ts`: `@astrojs/rss` の `rss()` に `title: "ytx"`, `description: t(lang, "blog.sub")`, `site: context.site`, `items` = `getPosts(lang)` の `{ title, pubDate: published, description, link: postUrl(...) }`、`customData: "<language>ja</language>"`（en は `en`）。

- [ ] **Step 1: build テストを書く**

```ts
test("about pages", () => { expect(read("about/index.html")).toContain("<article"); expect(read("en/about/index.html")).toContain('<html lang="en"'); });
test("rss both languages", () => { expect(read("rss.xml")).toContain("<language>ja</language>"); expect(read("en/rss.xml")).toContain("/en/blog/howto/simplepages-howto/"); });
test("sitemap has alternates", () => { const s = read("sitemap-0.xml"); expect(s).toContain('hreflang="en"'); expect(s).toContain("https://ytx.github.io/en/works/green/"); });
test("og tags", () => { const h = read("works/green/index.html"); expect(h).toContain('property="og:title"'); expect(h).toContain('property="og:image"'); });
test("404 pages", () => { expect(read("404.html")).toContain("ページが見つかりません"); expect(read("en/404.html")).toContain("Page not found"); });
```

- [ ] **Step 2: 失敗を確認** → FAIL
- [ ] **Step 3: 実装**
- [ ] **Step 4: 成功を確認** — `npm run check`、`npm run test`、`npm run test:build` が全て通る。
- [ ] **Step 5: 公開前チェック** — `git status` で `tmp/` が消えていること。GitHub の Settings > Pages > Source が "GitHub Actions" であることを README の手順に書く（設定自体は本人が行う）。
- [ ] **Step 6: Commit** — `git commit -m "About、RSS、サイトマップ、OGP を追加"`

---

## 完了条件

- `npm run check`, `npm run test`, `npm run test:build` が通る。
- main に push すると Actions が成功し、https://ytx.github.io/ と https://ytx.github.io/en/ が表示される。
- README の手順だけで、作品と記事（日英）を追加できる。
