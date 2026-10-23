# ytx.github.io

作品の紹介と日英ブログを載せた、ytx の個人サイト（Astro 製の静的サイト）。

## コマンド

- `npm run dev` : 開発サーバーを起動
- `npm run build` : `dist/` に静的サイトを生成
- `npm run test` : ユニットテストを実行
- `npm run test:build` : ビルドしてからビルド成果物のテストを実行
- `npm run check` : 型チェック

## 作品を追加する

`src/content/works/<slug>/index.md` を作る。日本語版では `title` `summary` `type` が必須（欠けるとビルドが失敗する）。親子作品にするときは子に `parent: <親の slug>` を書く（孫は不可）。

`thumbnail` は記事と同じく省略できる。指定すると作品カードと作品ページの先頭に表示される。省略した作品のカードには、記事と同じ代わりの画像が slug ごとに選ばれる。

作品ページの大きいボタンは `access` で決める。

| access | ボタン | 飛び先 | 必要な項目 |
|---|---|---|---|
| `try` | 使ってみる | `url` | `url` |
| `visit` | サイトを見る | `url` | `url` |
| `download` | ダウンロード | `url` | `url` |
| `source` | GitHub で見る | `repo` | `repo` |
| `contact` | お問い合わせ | メール（`src/lib/mail.ts` の宛先） | なし |

`access` を省くと、`type: app` なら `try`、それ以外は `visit` になる。必要な項目が無いとビルドが失敗する。`contact` の作品のカードには「コード非公開」のバッジが付く。`repo` を書くと（`access: source` のとき以外は）「ソースコード」のリンクも出る。

問い合わせ先のアドレスは HTML に書かず、符号化して埋め込み、ボタンに触れたときにブラウザ側で `mailto:` を組み立てる（クローラーに拾われにくくするため）。

```md
---
title: green（happy green tiles）
summary: タイルで管理する、やること・記録・タイマー
type: web            # app / web / desktop / tool / device
access: visit        # 省略可。try / visit / download / source / contact
url: https://green.sv4.me/
thumbnail: ./thumb.png
featured: true       # トップのキャッチに出す（どれも無ければ先頭 1 件）。子作品（parent 指定）でも使える
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

`thumbnail` は省略できる。指定すると記事カードと記事ページの先頭に表示される（記事ページに出るのは指定したときだけ）。サムネイルがない記事のカードには `src/assets/placeholders/` の画像から slug ごとに決まった 1 枚が自動で選ばれる。画像を追加・削除するだけで入れ替わる（長辺 1600px 程度の JPEG を推奨、EXIF は削除しておく）。空のときは `src/assets/post-placeholder.png` が使われる。

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

## AI に書いてもらう

下のプロンプトをそのまま AI に貼り付け、`【】` の部分を書き換えて使う。出力されたファイルは所定の場所に置く。

### 作品の紹介文を書いてもらう

```text
あなたは個人サイトの作品紹介を書くライターです。次の作品の紹介ページを、日本語版と英語版で書いてください。

【作品の情報】
- 名前：【作品名】
- URL：【https://...】
- 何をするものか：【機能や特徴を数行で】
- 読者：講演の参加者、仕事で関わる方（専門知識のない人も含む）

【書いてほしいもの】
1. summary：1 行、30 文字くらい。やわらかい口調で。
2. 本文（Markdown）：短い段落を 2〜4 つ。何であるか／誰に向くか／始め方／データやプライバシーに関する注意（必要なときだけ）。
3. 英語版の summary と本文。

【出力形式】
完成した `index.md` と `index.en.md` を、それぞれコードブロックで出力してください。
frontmatter はこのサイトの形式に合わせます。
- index.md：title, summary, type（app / web / desktop / tool / device）, access（try / visit / download / source / contact）, url, repo, thumbnail, youtube, featured, order, parent, tags, published
- index.en.md：title, summary のみ
わからない項目は、`# repo: ` のようにコメントアウトした空欄で残してください。推測で埋めないでください。
絵文字は使わないでください。
```

### ブログ記事を書いてもらう

```text
あなたは個人ブログの書き手です。次の内容で記事を書いてください。

【条件】
- テーマ：【記事のテーマ】
- カテゴリ：【gadget / car / car/maintenance / travel / diy / howto のどれか】
- 要点やメモ：【箇条書きで、わかっていること・伝えたいこと】
- 長さ：【例：1500 字くらい】
- 関連する作品（あれば）：【作品の slug】

【書き方】
- 本文は Markdown。見出しは h2 と h3 で構成する（h1 は使わない）。
- 親しみやすく、簡潔な文体。絵文字は使わない。
- 事実がわからない箇所は書き足さず、「要確認」と書いて残す。

【出力形式】
完成した `<slug>.md` を、frontmatter 付きでコードブロックに出力してください。
frontmatter：title, description（一覧や SNS に出る短い説明）, category, work, thumbnail, published（YYYY-MM-DD）, updated, draft（下書きなら true）。使わない項目は省いてかまいません。
slug は英数字とハイフンだけにしてください。親カテゴリの直下に置く記事の slug は、その親の子カテゴリ slug（例：car の下に maintenance）と同じにできません。
希望があれば、英語版の `<slug>.en.md` も同じ形式で出力してください。
```

## カテゴリを追加する

`src/data/categories.ts` の `CATEGORIES` に 1 行足す。子カテゴリは `parent` に親の slug を書く（階層は 2 段まで）。親カテゴリの直下に置く記事の slug は、その親の子カテゴリ slug と同じにできません。

```ts
{ slug: "maintenance", parent: "car", name: { ja: "メンテナンス", en: "Maintenance" }, color: "#dbe8fa" },
```

## 公開設定

GitHub の Settings > Pages > Source を "GitHub Actions" にする（リポジトリごとに 1 回、本人が行う）。あとは `main` に push すると `.github/workflows/deploy.yml` が動き、ビルドして公開される。GitHub Pages が返す 404 ページはルートの `404.html` だけなので、このページは日本語と英語の両方を表示する（`/en/404` は単体では配信されない）。

push 前に `npm run check`、`npm run test`、`npm run test:build` が通ることを確かめる。
