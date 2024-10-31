---
title: CI/CDワークフロー／パイプラインの構築
---

# CI/CDワークフロー／パイプラインの構築

## 1. いつ何をしたいのかを考える

### 1.1. 興味のあるイベントを探す（例）

#### github-flow
- pull request (feature* -> main)
- marge (feature* -> main)
- release (main -> release*)
- timer / ad hoc

#### git-flow
- pull request (feature* -> develop)
- marge (feature* -> develop)
- pull request (develop -> main)
- marge (develop -> main)
- release (main -> release*)
- timer / ad hoc

#### as text
- push to develop
- pull request (develop -> main)
- marge (develop -> main)
- timer / ad hoc

### 1.2. 実施したいことを洗い出す（例）
- インスペクション・ビルド・テスト
    - ソースコードの取得
    - 言語バージョンの設定
    - 依存ライブラリの取得
    - インスペクション実施
    - コンパイル・リンク
    - パッケージ化
    - テスト実施・カバレッジ取得
    - テストレポート作成
    - ドキュメント生成
- ステージングサーバでのテスト
    - ステージングサーバへの配備
        - データベースのバックアップ
        - データベースのマイグレーション
    - テスト実施
    - テストレポート作成
- 配備            
    - プロダクションサーバへの配備
        - データベースのバックアップ
        - データベースのマイグレーション
    - プロダクションサーバの動作確認
    - ライブラリリポジトリへの格納
    - 配布サイトへのアップロード
- その他
    - シミュレータでのテスト

### 1.3. イベント・実施項目のマトリクスを作る

1.1. で抽出したイベントに対して、1.2. の実施したいことを割り当てる

---

## 2. どうやって実現するかを検討する

### 2.1. 個々の実施したいことについて実現方法の調査

GUIを使わずに、コマンドのみで実現する方法を調査し、検証する。

### 2.2. 構成要素の選定 [(別表)](https://docs.google.com/spreadsheets/d/12Il34IC7_Fu7qVumBVeqZMOrrEduMCt9A97NR9yxlcI/edit?usp=sharing)

ツールの機能、守備範囲（ツール間の機能重複）・安定性・コスト・ライセンス・継続性などを
考慮しながら、使用するツール類を検討する。

- Build / Inspection / UnitTesting Tools
    - 言語依存
- SCM / CI Tool
    - runner : hosted / self hosted
- Product Testing Tools
    - 外部仕様の確認（アプリケーションの種類に依存）
- IaC Tool
    - 環境依存

---

## 3. ワークフロー／パイプラインを構築する

1~2の結果を組み立てる。

- Gitlab : Pipelines / Jobs
- Github : Workflow / Jobs / Actions

---

## 4. ワークフロー／パイプラインを導入する

### 4.1. 導入を阻害しようとする人のよくある意見

できない理由ではなく、できる方法を考える

- 工数に余裕がない、納期が決まっている
    - クリティカルなプロジェクトから始めることは避ける
    - 開発の楽しさ、安心感を得ることから始める
- テストを書くのが面倒、テストの粒度はどうするのか
    - 現実的なサンプルを複数用意する
    - テストの分類（アジャイルテストの４象限、テストサイズなど）
    - テストファーストの実践
- 品質基準が既存の方法に適合しない
    - 品質基準の再検討、プロジェクト計画書でのオーバーライド
- ノウハウがない
    - 関係ありそうなツール・手法はできるだけ調査する

---

## 5. ワークフロー／パイプラインを継続して運用する

運用方法をマニュアル化して関係者に周知する。

- ジョブの確認方法
- ジョブが失敗した時の対応

以下のようなケースについても、マニュアル化しておくと良い。

- 緊急リリース（ソースコード、リソース）
- タイマーイベントからのジョブが失敗した時の対応（開発終了後）
- 担当者の変更・追加（引継手順なども）
- その他、アドホックに発生しそうなシナリオ

---

## references

- [Gitlab Documents](https://docs.gitlab.com)
- [Github Documents](https://docs.github.com)
    - [GitHub ActionsでSSHを使う](https://qiita.com/shimataro999/items/b05a251c93fe6843cc16)
- [Docker Documents](https://docs.docker.com/manuals/)
- [Ansible Documents](https://docs.ansible.com/ansible/latest/index.html)
- [Selenium Documents](https://www.selenium.dev/documentation/)
- [Cypress Documents](https://docs.cypress.io/guides/overview/why-cypress)


