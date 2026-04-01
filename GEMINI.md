# Gemini Project Context

## プロジェクトの目的
- GStack AI エニジニアリング・ワークフロー・フレームワークを Google Antigravity 環境へ最適化し、統合するためのアダプター・キットです。

## 使用している技術
- Node.js / Bun (Runtime)
- Git Submodule (Dependency Management)
- Antigravity / Serena MCP (Agent Platform)

## 主要な設定ファイル
- `package.json`
- `src/convert-skills.js`

## スキル・ルーティング

ユーザーのリクエストが以下のスキルに該当する場合、常に最初の動作として **Skill ツール** を呼び出してください。
これらのスキルには専用のワークフローが定義されており、高精度な推論が提供されます。

主要ルーティング・ルール:
- プロダクトのアイデア、実現可能性の検討、ブレーンストーミング → invoke office-hours
- バグ、エラー、原因調査 → invoke investigate
- シップ、デプロイ、プッシュ、PR作成 → invoke ship
- QA、サイトのテスト、バグ発見 → invoke qa
- コードレビュー、差分の確認 → invoke review
- リリーズ後のドキュメント更新 → invoke document-release
- 週次レトロスペクティブ → invoke retro
- デザインシステム、ブランド相談 → invoke design-consultation
- ビジュアル監査、デザイン調整 → invoke design-review
- アーキテクチャ・レビュー → invoke plan-eng-review
- 自己反省、行動規範の確認、反省の実施 → invoke antigravity-reflection

## AI エージェント活用ガイド (GStack Workflow)

このプロジェクトでは、GStack の強力な「自律型ワークフロー」を活用します。

### 1. プランニングと CEO レビューの重要性
実装を開始する前に、必ず `/autoplan` または個別のレビュー（`/plan-ceo-review` 等）を実行してください。
特に **CEO レビュー** では、AIが「開発者」ではなく「シリコンバレーの創業者」として振る舞い、プランの妥当性を厳しく（しかし建設的に）評価します。

### 2. インタラクティブな意思決定 (AskUserQuestion)
GStack のワークフロー実行中、AIは以下のフォーマットで質問を投げることがあります：
- **Re-ground**: 現在の状況の再確認。
- **Simplify**: 課題の平易な説明。
- **Recommend**: AI 推奨の選択肢（網羅性スコア 10/10 を優先します）。
- **Options**: A, B などの選択肢の提示。
ユーザーは **「Aでお願いします」** のように答えるだけで、AIが自律的に作業を継続します。

### 3. 完全性の原則 (Boil the Lake)
AIによる実装は限界費用が極めて低いため、常に「ひとまず動くコード」よりも「エッジケースまで考慮した完璧な実装」を推奨します。AIが提示する「網羅性 10/10」の選択肢を選ぶことで、技術的負債の少ない高品質なコードが手に入ります。
