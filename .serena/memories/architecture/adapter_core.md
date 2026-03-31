# Gstack Antigravity Adapter Project

## アーキテクチャと原則
- **gstack非汚染原則 (Non-pollution)**: `gstack/` ディレクトリ配下はオリジナルリポジトリの素材（Read-Only）として扱い、絶対に直接編集しません。
- **変換スクリプト**: `src/convert-skills.js` が中心的な役割を担います。
  1. `gstack/` 内部の全 `SKILL.md` を読み込む。
  2. レガシーな `$B`（ブラウザデーモン）操作コマンドを、Antigravity 組み込みの `browser_subagent` へ置換するガイドライン（Antigravity Browser Guidelines）をプロンプトの冒頭に注入。
  3. `~/.claude/skills/gstack/` といったハードコードされた絶対パスを、現在のプロジェクトの相対パス `./gstack/` へと正規表現で一括置換。
  4. 自律実行用フラグ `// turbo-all` を付与し、成果物を `.agents/workflows/` ディレクトリへと独立して書き出す。

## 環境・ビルド設定
- **セットアップ (`setup.js`)**: `npm run setup` にて実行。`bun` がインストールされていない環境（Windows等）でもクラッシュせずにgraceful degradation（機能縮退）し、変換スクリプトだけは確実に通るよう設計しています。
- **実行環境**: Windows 上の `pwsh` や `bash`（Git Bash互換）にて、ファイルパスやコマンドがネイティブに解決され、エラーなく自律実行できることを保証しています。