# ytx.github.io

作品の紹介と日英ブログを載せた、ytx の個人サイト（Astro 製の静的サイト）。

## コマンド

- `npm run dev` : 開発サーバーを起動
- `npm run build` : `dist/` に静的サイトを生成
- `npm run test` : ユニットテストを実行
- `npm run test:build` : ビルドしてからビルド成果物のテストを実行
- `npm run check` : 型チェック

## 作品を追加する

`src/content/works/<slug>/index.md` を作り、同じフォルダにサムネイル画像を置く。日本語版では `title` `summary` `type` `url` `thumbnail` が必須（欠けるとビルドが失敗する）。親子作品にするときは子に `parent: <親の slug>` を書く（孫は不可）。

```md
---
title: green（happy green tiles）
summary: タイルで管理する、やること・記録・タイマー
type: web            # app か web
url: https://green.sv4.me/
thumbnail: ./thumb.png
featured: true       # トップのキャッチに出す（どれも無ければ先頭 1 件）
order: 10            # 小さい順に並ぶ
published: 2026-03-01
---

紹介文。
```

## 記事を追加する

`src/content/blog/<slug>.md` を作る。`category` は `car` や `car/maintenance` のように書く（未定義のカテゴリはビルドが失敗する）。`draft: true` の記事は公開ビルドに含まれない。作品の関連記事にするときは `work: <作品の slug>` を書く。

```md
---
title: オイル交換をした
description: 一覧や SNS に出る短い説明
category: car/maintenance
published: 2026-03-12
---

本文。
```

## 英語版を追加する

日本語版と同じ場所に `.en` を付けたファイルを置く（記事は `oil-change.en.md`、作品は `green/index.en.md`）。作品の英語版は `title` と `summary` だけ書けばよく、`url` などは日本語版から引き継ぐ。英語版が無いページは、日本語の内容がそのまま表示される。

```md
---
title: Changing the oil
description: A short description
category: car/maintenance
published: 2026-03-12
---

Body text.
```

## カテゴリを追加する

`src/data/categories.ts` の `CATEGORIES` に 1 行足す。子カテゴリは `parent` に親の slug を書く（階層は 2 段まで）。親カテゴリの直下に置く記事の slug は、その親の子カテゴリ slug と同じにできません。

```ts
{ slug: "maintenance", parent: "car", name: { ja: "メンテナンス", en: "Maintenance" }, color: "#dbe8fa" },
```

## 公開設定

GitHub の Settings > Pages > Source を "GitHub Actions" にする（リポジトリごとに 1 回、本人が行う）。あとは `main` に push すると `.github/workflows/deploy.yml` が動き、ビルドして公開される。push 前に `npm run check`、`npm run test`、`npm run test:build` が通ることを確かめる。
