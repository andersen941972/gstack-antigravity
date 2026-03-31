# gstackのAntigravity対応: 課題1の実装計画（改訂版：gstack非汚染アプローチ）

## 背景・目的
ユーザーからの追加指示により、**「クローンした `gstack/` ディレクトリ内部は一切汚さず、あくまで分析・開発の素材（読み取り専用）として扱う」** という制約が加わりました。
また将来的なGitHub公開を見据え、プロジェクトルート（`J:\myproject\gstack_antigravity`）側に専用の変換スクリプトと出力先を配置する構成に変更します。

## ユーザーレビューを要求する項目
> [!IMPORTANT]
> 前回の実装計画（`gstack` 内部のソースを直接書き換えるアプローチ）を破棄し、外部から `gstack` をラップする独立したスクリプトを作成するアプローチへ変更しました。この方針にご承認ください。

## 提案されるディレクトリ構造と変更内容

### 1. ディレクトリ構成の改善（対応済）
GitHub公開を見据え、以下の構造を採用します：
- `docs/` : ドキュメント（分析結果・実装計画・タスク）
- `src/` : ラッパーおよび変換用スクリプト
- `gstack/` : 読み取り専用の素材としてそのまま残す
- `.agents/workflows/` : 変換スクリプトにより生成されるAntigravity向けワークフロー群

### 2. 変換スクリプトの開発（`src/convert-skills.js`）
`gstack` 内部のファイルを直接書き換えるのではなく、**外部スクリプトが読み取り＆変換を行う**アーキテクチャにします。
- **インプット:** `gstack/*/SKILL.md` (元から含まれているビルド済みのMarkdownファイル)
- **変換処理:**
  1. YAMLフロントマターを読み取り、`name` と `description` を抽出する。
  2. Antigravity用に `description: "[name] - [description]"` という一行のフロントマターに整形する。
  3. `gstack` 独自のBashスクリプトがAntigravityで操作ブロックされないように、Markdown本文の先頭に `// turbo-all` アノテーションを付付与する。
- **アウトプット:** `.agents/workflows/[skill-name].md` として出力する。

### 3. バッチ実行用パッケージ/スクリプトの整備
- プロジェクトルートに『package.json』等の配置。
- 『npm run build-skills』で、サブモジュールからAntigravity向けに最新のワークフローを一括変換して出力。

### 4. ワークフロー依存関係の調査とドキュメント化
- **重要:** 各ワークフロー（`/plan-ceo-review`, `/review`等）が実行の前提としているファイル（例: `implementation_plan.md`）をすべて洗い出します。
- これを『README.ja.md』または『WORKFLOWS_GUIDE.ja.md』に「前提条件」としてセクションを設け、明文化します。

## 検証計画
- `node src/convert-skills.js` を実行し、`gstack/` ディレクトリ内部が一切変更されていない（Gitステータスに変更が出ない）ことを確認します。
- `.agents/workflows/` ディレクトリ配下に、正しいフォーマット（フロントマターと `// turbo-all` を含む）の `qa.md` 等が生成されていることを確認します。
