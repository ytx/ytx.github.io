---
title: CICDワークフロー／パイプラインの構築
---

# CICDワークフロー／パイプラインの構築

## 1. いつ何をしたいのかを考える

### 1.1. 興味のあるイベントを探す（例）
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
    - テスト実施
    - テストレポート作成
- 配備            
    - プロダクションサーバへの配備
    - プロダクションサーバの動作確認
    - ライブラリリポジトリへの格納
    - 配布サイトへのアップロード

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
    - [document](https://docs.gitlab.com)
- Github : Workflow / Jobs / Actions
    - [document](https://docs.github.com)

