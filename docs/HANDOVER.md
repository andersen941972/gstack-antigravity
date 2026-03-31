# プロジェクト引継ぎ資料 (HANDOVER.md)

このドキュメントは、本プロジェクト（gstack-antigravity）の現在のステータスと、今後の開発・運用に必要な情報をまとめたものです。

## 1. プロジェクトの目的
[garrytan/gstack](https://github.com/garrytan/gstack) の強力なエンジニアリング・ワークフローを、Google Antigravity 環境で自律的に動作させるためのアダプター層を構築すること。

## 2. アーキテクチャの要点 (非汚染アプローチ)
- **素材 (`gstack/`)**: クローンしたオリジナルのリポジトリは「読み取り専用」として扱います。
- **変換ロジック (`src/`)**: `convert-skills.js` が `gstack` 内部の `SKILL.md` を読み取り、Antigravity仕様に変換して `.agents/workflows/` に書き出します。
- **ブラウザ統合**: `$B` コマンドを `browser_subagent` ツールに翻訳するガイドラインを各ワークフローに自動注入しています。

## 3. セットアップと更新手順
新しい環境でプロジェクトを開始する場合：
```bash
# 依存関係の解決とワークフローの自動生成
npm run setup
```
`gstack` 本体の内容を更新してワークフローに反映させる場合：
```bash
npm run build-skills
```

## 4. 現在の進捗状況 (Task Status)
- [x] **課題1: ワークフロー変換**: YAMLフロントマターの適合とターボモードの有効化。
- [x] **課題3: ブラウザ操作の統合**: `$B` から `browser_subagent` へのプロンプト誘導。
- [x] **課題4: セットアップの自動化**: `setup.js` による一括初期化。
- [ ] **課題5: Windows環境の検証**: 現在の `pwsh` 環境での最終的な動作確認。

## 5. 後任エージェントへの申し送り事項
- **Serena MCP の活用**: 本プロジェクトの情報は Serena MCP のメモリ（`global/purpose`, `style_guide`, `suggested_commands`）に詳細に記録されています。
- **browser_subagent の優位性**: `$B` を直接動かすのではなく、 `browser_subagent` にタスクとして委譲するプロンプト戦略を維持してください。
- **Windowsパス問題**: パス区切り文字等で問題が出た場合は、 `setup.js` や `src/convert-skills.js` 内の `path.join` 処理を確認してください。

---
作成日: 2026-03-31
担当エージェント: Antigravity
