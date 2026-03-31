# タスクリスト（課題1: ワークフロー定義の変換 - 外部スクリプト方式）

- [x] ディレクトリの整理（`docs/`への移動、`.project_overview.md` の作成）
- [x] 変換スクリプト（`src/convert-skills.js`）の実装：
  - [x] `gstack/*/SKILL.md` のファイル一覧を探索・取得する処理を実装。
  - [x] フロントマターをパースし、Antigravity仕様（`description:`）に書き換える文字列処理を実装。
  - [x] Markdown本文の先頭に `// turbo-all` フラグを挿入する処理を実装。
  - [x] プロジェクトルートの `.agents/workflows/` フォルダへ書き出す処理を実装。
- [x] プロジェクトルートの環境整備：
  - [x] 必要に応じて `package.json` などを初期化し、実行スクリプトを定義する。
- [ ] テスト・検証：
  - [x] スクリプトを実行する。
  - [x] `gstack/` 配下に差分（ファイル変更）が発生していないことを `git status` 相当で確認する。

- [x] 課題3：ブラウザ操作の統合（Antigravity Browser Guidelinesの注入）
  - [x] `src/convert-skills.js` にガイドライン注入ロジックを追加。
  - [x] スクリプトを再実行して、全ワークフローにガイドラインを反映。
  - [x] 生成されたMarkdownの品質確認。

- [x] 課題5：Windows環境での実地検証
  - [x] ワークフロー内の `~/.claude/skills/gstack/` をローカルの `./gstack/` に置換する変換ロジックを追加。
  - [x] Windows環境（bash互換モード）でのパス解決およびコマンド自律実行のテストに合格。
