---
title: webarchive-server
summary: 保存した Web ページにメモとタグを付けて探せる
type: tool
access: source
repo: https://github.com/ytx/webarchive-server
thumbnail: ./thumb.png
featured: true
order: 50
published: 2026-09-03
---

ブラウザ拡張の [SingleFile](https://www.getsinglefile.com/) で保存した Web ページを、Dropbox などの同期フォルダにためておき、メモとタグを付けて検索できるようにするローカルサーバーです。手元のパソコンで動かし、ブラウザで一覧と詳細の画面を開いて使います。

保存先はローカルのフォルダとして見えるものなら何でもかまいません。Dropbox のほか、iCloud Drive、OneDrive、Google Drive for desktop、Syncthing などで同期するフォルダで動きます。サーバーは各サービスの API を使わず、ファイルを書いて変更を見張るだけなので、複数のパソコンで同じアーカイブを共有できます。同期の競合で生まれたコピーは、一覧に「競合」として表示します。

Node.js 22.13 以上があれば、`npm install -g github:ytx/webarchive-server` で入れて `webarchive` で起動できます。初回は設定画面が開くので、保存先のフォルダを選べば使い始められます。macOS と Windows では、ログイン時に自動で起動するサービスとして登録できます。同期フォルダは「オンラインのみ」のような実体を手元に置かない設定にせず、オフラインでも使える状態にしておいてください。
