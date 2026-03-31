# GStack Antigravity 🚀
*(Google Antigravity Adapter for Garry Tan's GStack)*

このプロジェクトは、Garry Tan氏による素晴らしいAIビルダー向けオープンソース・フレームワークである [**gstack**](https://github.com/garrytan/gstack) を、強力な自律型AIアシスタント「**Google Antigravity**（Claude Code / Serena MCP 等）」環境上で最適に動作させるために作られた非公式のアダプター・ラッパーです。

**✨ AIによる自律的な構築 ✨**  
このアダプターは、ゼロからコンセプトの分析、アーキテクチャ設計、コーディング、そして実機テスト検証に至るまで、完全に **Google Antigravity 自身によって自律的に構築** されました。AIが自らのワークフローを拡張するために、AI自身が書いたコードです。

**🙏 オリジナルへの最大限の敬意と感謝**  
私たちは元の `gstack` が持つ「複雑なソフトウェア開発プロセスを仕組み化し検証する」という圧倒的なビジョンと、世界中のビルダーを心からエンパワーしようとする美しく洗練されたプロンプト設計に、深い感銘と敬意を抱いています。
原作者の「**MIT. Free forever. Go build something.**」という力強い思想を尊重し、このプロジェクトも完全にMITライセンスとして公開されます。

---

## 💡 プロジェクトの目的とアーキテクチャ

GStackは、`/qa`、`/autoplan`、`/review` などの精巧なAIエンジニアリング・ワークフローを提供しますが、本来は特定のCLIツール（Claude Code）や固有のローカルバイナリ（Bunベースの `gstack-browse` デーモンなど）に強く依存しています。

本プロジェクトは、以下の「**非汚染の原則（Not-polluting Principle）**」をもって、それらを Antigravity 環境へシームレスに移植します。

1. **オリジナルを汚さない**: `gstack/` は git submodule のように「読み取り専用の素材」として扱います。絶対に書き換えません。
2. **ブラウザ操作の委譲**: レガシーな `$B` コマンドを、Antigravity 組み込みの強力な `browser_subagent` への自然言語によるタスクへと自動翻訳します。
3. **パスのローカライズ**: グローバルインストール前提のハードコードされたパスを、現在のリポジトリ直下の相対パスへ安全に変換し、Windows等のあらゆる環境で動くようにします。
4. **自律実行（Turbo-all）**: 生成された `.agents/workflows/*.md` ワークフローにより、Antigravity がAI自身でコマンドを叩き、ブラウザを操作し、レビューを完走させます。

---

## ⚙️ 使い方（Getting Started）

### 1. セットアップ
リポジトリをクローン後、初期化セットアップを実行します。
（内部コマンドを実行するため、Node.js のインストールが必要です）

```bash
npm run setup
```
- このコマンドにより、内部で `bun install / build` (利用可能な場合) が走り、オリジナルワークフロー群が `src/convert-skills.js` を経由して `.agents/workflows/` へ Antigravity 用として変換・出力されます。

### 2. ワークフローの実行
Antigravity 搭載のエディタ（またはターミナル）を開き、チャットプロンプトに対して以下のようにお好きなワークフロー名を呼び出すだけです。

- **`/qa [URL]`** : 指定したローカル環境等で、ブラウザを使った品質保証テストを自律的に行います。
- **`/review`** : 現在のGitワーキングツリー（または未プッシュのブランチ）を読み込み、SQLインジェクションやロジックの脆さをシニアエンジニアの視点でレビューします。
- **`/autoplan`** : 新機能の開発前に、CEO・Design・Engineeringの多角的な観点で壁打ちと方針の決定をAIが自律的に行います。

---

## 📂 ディレクトリ構成

- `gstack/` - オリジナルのgstackソースコード群（※変更厳禁）
- `src/` - GStackをAntigravity形式へ翻訳・変換するアダプタースクリプト
- `.agents/workflows/` - 生成された10+種類のAntigravity用ワークフロー
- `docs/` - 開発履歴、アーキテクチャ分析資料、タスクリスト等

---

## 🤝 貢献とコミュニティ (Contributing)

私たちは開発者が「何かを作る」プロセスを高速化することを全力で支援します。
プルリクエスト、Issue、ご意見等はお気軽にどうぞ！  
また、派生元の圧倒的な思想・デザイン設計については、ぜひ[オリジナルの GStack リポジトリ](https://github.com/garrytan/gstack)も併せてご参照ください。

## 📜 ライセンス (License)

This project, like the original, is licensed under the [MIT License](LICENSE).
**Free forever. Go build something.**
