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

---

## 🚀 インストール・セットアップ

本アダプターは、既存のプロジェクトに Git サブモジュールとして追加して使用します。

### 1. サブモジュールの追加

プロジェクトのルートディレクトリで以下のコマンドを実行します。

```bash
# PowerShell (Windows) の場合
git submodule add https://github.com/andersen941972/gstack-antigravity.git tools/gstack_antigravity

# または Git Bash / CMD の場合
git submodule add https://github.com/andersen941972/gstack-antigravity.git tools/gstack_antigravity
```

### 2. プロジェクトルートの明示（推奨）
より確実にセットアップを行うために、プロジェクトのルートディレクトリに空のマーカーファイルを作成することを推奨します。これにより、多言語環境や複雑なディレクトリ構造でも誤判定を防げます。

```bash
# PowerShell (Windows)
New-Item project-root.txt -ItemType File

# Bash / Zsh
touch project-root.txt
```

### 3. 自動セットアップの実行

```bash
cd tools/gstack_antigravity
node setup.js
```

*(💡 Windows で Node.js がインストールされている場合、`setup.bat` をダブルクリックするだけでも実行可能です。)*

---

## 📁 理想的なプロジェクト構成（Polyglot 対応）

セットアップが完了すると、プロジェクトは以下のようになります。本アダプターは Python, Go, Node.js 等、あらゆる言語のプロジェクトに対応しています。

#### 🟢 導入前（Initial State）
```text
project-example/
├── project-root.txt           <-- 【推奨】プロジェクトの「中心点」を示すマーカー
├── src/                       <-- あなたのソースコード
├── requirements.txt           <-- (Python の場合) 自動検出のヒント
├── package.json               <-- (Node.js の場合) 自動検出のヒント
└── ... 
```

#### 🔵 導入後（GStack Applied）
```text
project-example/
├── project-root.txt
├── GEMINI.md                  <-- 【自動配置】AIエージェントの指針・ルーティング
├── .agents/                   <-- 【自動配置】Slashコマンドの定義
│   └── workflows/             
│       ├── qa.md              
│       ├── review.md          
│       └── ... (全32種)
│
├── tools/                     
│   └── gstack_antigravity/    <-- 【サブモジュール】
│       ├── setup.js           
│       ├── gstack/            
│       └── ... 
│
└── ... 
```

#### セットアップ・スクリプトが自動で行うこと：
1.  **GStack 本体の初期化**: `gstack` サブモジュールのクローンと依存関係のビルド（Bun を使用）。
2.  **ワークフローの生成**: 30種類以上のエンジニアリング・ワークフローを Antigravity 形式へ一括変換。
3.  **GEMINI.md への自動注入**: 親プロジェクトのルートにある `GEMINI.md` に、GStack を呼び出すためのルーティング・ルールを自動的に追記します（既存ファイルがある場合はバックアップを作成します）。

### 3. ワークフローの実行
Antigravity（Serena MCP 等）を開き、チャットプロンプトに対して以下のようにスラッシュコマンドを呼び出すだけです。

- **`/qa [URL]`** : ブラウザを自律操作して品質テストを行い、バグを自動修正します。
- **`/review`** : 現在のGitの差分を読み込み、シニアエンジニアの視点でコードレビューを行います。
- **`/autoplan`** : 開発前に、CEO・Design・Engineeringの3視点でプロジェクトの方向性を壁打ちします。

---

## 🚀 利用可能なワークフロー（スラッシュコマンド）

Antigravity環境のチャット欄で以下のコマンドを入力することで、GStack由来の高度な自律ワークフローを呼び出せます。

| コマンド | 概要 |
| :--- | :--- |
| `/autoplan` | **自動レビューパイプライン**: 開発前にCEO、デザイン、エンジニアの3視点からプランを多角的に分析・決定します。 |
| `/review` | **PRレビュー**: 現在の差分やコミットを読み込み、SQL安全性やロジックの脆さをシニアエンジニアの視点でレビューします。 |
| `/qa` | **自律QAテスト**: ブラウザを操作してUIの品質テストを行い、発見したバグをその場で修正します。 |
| `/qa-only` | **レポート専用QA**: テストのみを実行し、詳細な不具合レポートを作成します（自動修正は行いません）。 |
| `/plan-ceo-review` | **CEOモード**: プロダクトの戦略的価値や10つ星体験の観点からプランを再考します。 |
| `/plan-design-review` | **デザインレビュー**: UI/UXの統一感やマイクロアニメーション、モダンなデザイン要件をチェックします。 |
| `/plan-eng-review` | **エンジニアリングレビュー**: アーキテクチャ、依存関係、テスト容易性などの技術面を厳格に評価します。 |
| `/benchmark` | **性能回帰テスト**: ブラウザを使用して、複数回の試行からパフォーマンスの低下を検知します。 |
| `/canary` | **カナリア監視**: デプロイ後の稼働中のアプリを監視し、コンソールエラーなどをチェックします。 |
| `/careful` | **セーフティガード**: `rm -rf` などの破壊的なコマンドを実行する前に警告を表示し、誤操作を防ぎます。 |
| `/freeze` | **編集制限**: セッション中、編集可能なファイルを特定のディレクトリ配下に制限します。 |
| `/unfreeze` | **制限解除**: `/freeze` によるディレクトリ制限を解除します。 |
| `/learn` | **学習管理**: プロジェクトでの「学び（Learnings）」をレビュー、検索、エクスポートします。 |
| `/retro` | **週次レトロスペクティブ**: コミット履歴や作業パターンを分析し、一週間の振り返りを行います。 |
| `/browse` / `/gstack` | **ブラウザツール**: 高速なヘッドレスブラウザを起動し、QAテストや動作確認を自律的に行います。 |
| `/connect-chrome` | **実機連携**: サイドパネル拡張機能が有効な実機のChromeを起動して連携します。 |
| `/setup-browser-cookies` | **Cookieインポート**: 実機のブラウザからCookieをインポートし、テスト環境へ引き継ぎます。 |
| `/land-and-deploy` | **自動デプロイ**: PRのマージからCI待機、本番デプロイまでの一連の作業を自動化します。 |
| `/setup-deploy` | **デプロイ設定**: `/land-and-deploy` で使用するデプロイ環境の設定を行います。 |
| `/document-release` | **ドキュメント更新**: リリース後にプロジェクトドキュメントやREADMEを自動的に最新化します。 |
| `/gstack-upgrade` | **本体アップグレード**: GStackのコアシステムを最新バージョンへ安全にアップグレードします。 |

---

## 📂 ディレクトリ構成

- `gstack/` - オリジナルのgstackソースコード群（※変更厳禁）
- `src/` - GStackをAntigravity形式へ翻訳・変換するアダプタースクリプト
- `.agents/workflows/` - 生成された10+種類のAntigravity用ワークフロー
- `docs/` - 開発履歴、アーキテクチャ分析資料、タスクリスト等

---

## 📊 実行事例（Case Studies）

GStack Antigravity を導入することで、AI エージェントがプロジェクトをどのように解析し、支援するかを実例とともに紹介します。
これらは、実際の開発現場で得られた高密度な回答をベースに構成された「生きた事例」です。

- **[/learn](./docs/examples/LEARN_CASE_STUDY.ja.md)**: プロジェクトの全容と技術スタックの深い理解。
- **[/qa](./docs/examples/QA_CASE_STUDY.ja.md)**: クリティカルなバグの発見と修正案の提示。
- **[/review](./docs/examples/REVIEW_CASE_STUDY.ja.md)**: セキュリティとパフォーマンスに踏み込んだレビュー。
- **[/investigate](./docs/examples/INVESTIGATE_CASE_STUDY.ja.md)**: 根本原因の特定と再発防止策の策定。
- **[その他の事例一覧はこちら](./docs/examples/README.ja.md)**

---

## 🤝 貢献（Contributing）

私たちは開発者が「何かを作る」プロセスを高速化することを全力で支援します。
プルリクエスト、Issue、ご意見等はお気軽にどうぞ！  
また、派生元の圧倒的な思想・デザイン設計については、ぜひ[オリジナルの GStack リポジトリ](https://github.com/garrytan/gstack)も併せてご参照ください。

## 📜 ライセンス (License)

This project, like the original, is licensed under the [MIT License](LICENSE).
**Free forever. Go build something.**
