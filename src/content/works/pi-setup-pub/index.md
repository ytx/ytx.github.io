---
title: pi-setup-pub
summary: Raspberry Pi を、コマンド 1 つで用途の決まった機器に仕上げる
type: tool
access: source
repo: https://github.com/ytx/pi-setup-pub
order: 90
published: 2026-10-13
---

書き込んだばかりの Raspberry Pi OS の SD カードから、キオスク画面、カメラ、小さなサーバーのような用途の決まった機器を、コマンド 1 つで何度でも同じように仕上げるための Ansible のロールと Playbook です。Raspberry Pi を家電のように運用する講義やセミナーの教材として公開しています。

ロールは、読み取り専用のルートファイルシステム、ウォッチドッグ、固定 IP、Wi-Fi が切れたときの切り替え、RTC、ファン付きケースの設定など、部品ごとに分かれています。どの機器にどのロールを使うかを Playbook に書き、機器ごと・グループごとの設定はインベントリのファイルに分けて置きます。パスワードや鍵はリポジトリの外のディレクトリに書くので、自分の機器や秘密の値は、このロールを使う非公開のリポジトリ側に置けます。

ロールは作者が実際に使っている構成から、環境に固有の部分を取り除いて少しずつ移しています。Raspberry Pi OS(Debian 13 trixie ベース)で作っており、操作する側には Python 3.10 以上の Linux か macOS、または別の Raspberry Pi が必要です。MIT ライセンスです。
