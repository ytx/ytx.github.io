---
title: simplePages
summary: index.html 1 ファイルで動く小さな Web ページ集
type: app
url: https://ytx.github.io/simplePages/
thumbnail: ./thumb.png
featured: true
order: 30
published: 2026-05-01
---

index.html 1 ファイルだけで動く小さな Web ページを集めたリポジトリです。ビルドも外部ライブラリも使わず、設定とデータはブラウザの localStorage にだけ保存されるので、ファイルを開くか静的ホスティングに置くだけで使えます。

用途は 3 つに分かれています。

- キオスク向け: 横長の画面に常時表示して眺めるページ。天気予報(weather)、Google カレンダーの予定表(calendar)、キッチンタイマー(k_timer)
- PC 作業向け: 作業の脇で操作するページ。講義用タイマー(l_timer)
- スマートフォン向け: ホーム画面に追加して指で使うページ。面会日程の候補提示(time4u)、睡眠中央時刻の記録(midsleep)

どのページも右上のアイコンでダーク/ライト、拡大/縮小、日英の切り替えができ、設定の JSON を書き出し・読み込みして別の端末へ移せます。ソースは [GitHub](https://github.com/ytx/simplePages) で MIT ライセンスとして公開しています。
