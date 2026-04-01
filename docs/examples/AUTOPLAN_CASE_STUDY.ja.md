# 📐 ケーススタディ：/autoplan（CEOレビュー・詳細な実装計画）

GStack Antigravity が「ただの ToDo リスト」ではなく、**「ビジネス上の妥当性」と「技術的な堅牢性」**を両立させた実装計画を策定する様子を実演します。

## 📥 プロンプト（指示内容）

> **/autoplan**  
> `project-earn` に「チャート画像の直接解析機能」を追加したい。Gemini のマルチモーダル機能を活用して、テクニカル分析の結果を言語化する機能を実装してください。

---

## 📤 実行結果

プロジェクト・プランナーとして `チャート画像解析機能` の実装計画を策定します。

### 1. CEO レビュー（Silicon Valley Founder Mode）
この機能は「技術的に面白い」だけでなく、**「収益（Alpha）」に直結するか**が重要です。

- **評価**: 🌟🌟🌟🌟🌟 (10-star product)
- **フィードバック**: 単に「分析結果を表示する」だけでは不十分です。分析結果を「損切り/利確の閾修正」に自動反映させる、**クローズドループ・システム**（閉じられた実行系）を目指してください。UI よりも先に API 連携を最優先します。

### 2. エンジニアリング・マネージャーの視点
- **依存関係**: `Gemini-pro-vision` を最新の SDK で利用する必要があります。既存の `src/gemini_analyzer.py` の抽象クラスを拡張してください。
- **リスク**: 画像（PNG/JPG）の容量制限による API エラーが懸念されます。送信前にリサイズする前処理（Preprocessing）を `src/utils/image.py` に新規実装すべきです。

### 3. 実装フェーズ（タスク分割）
- **[ ] [NEW] `src/utils/image_optimizer.py`**: 画像の圧縮とエンコード（Base64）。
- **[ ] [MODIFY] `src/gemini_analyzer.py`**: `Vision` モデルへの対応とプロンプト・エンジニアリング。
- **[ ] [MODIFY] `src/main.py`**: チャート・スクリーンショット取得後の分析フロー統合。

### 4. 網羅性スコア (Comprehensiveness Score)
- **Score**: 10/10 (Edge cases for API timeout and Image format included.)
