# 🔍 ケーススタディ：/review（プロフェッショナルなコードレビュー）

GStack Antigravity が「単なる文法チェック」ではなく、**「アーキテクチャの妥当性」や「セキュリティリスク」**に踏み込んだレビューを行う様子を実演します。

## 📥 プロンプト（指示内容）

> **/review**  
> 新しく追加された `src/ollama_analyzer.py` のレビューをお願いします。特に、プロンプトインジェクションのリスクや、非同期処理の効率について確認してください。

---

## 📤 実行結果

レビュアーロールとして `src/ollama_analyzer.py` のコードレビューを実施しました。

### 1. 全体的な評価
コードは Python 3.12 の型ヒントを適切に使用しており、非常にクリーンです。しかし、大規模言語モデル (LLM) と連携するシステムとして、以下の 3 点について改善の余地があります。

### 2. 重大な指摘事項（セキュリティ）
- **プロンプトインジェクションの脆弱性**: 
  [ollama_analyzer.py:L45](file:///src/ollama_analyzer.py#L45) で、ユーザー入力をそのままプロンプトの `system` メッセージに連結しています。攻撃者が「システムルールを無視せよ」という入力を与えた場合、制御を奪われる可能性があります。
  - **改善策**: 入力のサニタイズ（フィルタリング）処理を導入するか、ユーザー入力とシステムプロンプトを明確に分離したメッセージ構造を採用してください。

### 3. パフォーマンスの改善点（非同期処理）
- **セッションの再利用**:
  各リクエストごとに `HTTPX` のセッションを新規作成していますが、これは接続のオーバーヘッドが大きいです。
  - **改善策**: `httpx.AsyncClient()` をシングルトンパターンで管理し、複数のリクエストで接続を共有（Keep-alive）するように変更してください。

### 4. シニアエンジニアの推薦コード
以下のように修正案を提示します。

```python
# 修正前:
# async with httpx.AsyncClient() as client:
#     response = await client.post(url, json={"prompt": tainted_input})

# 修正後（セッション再利用 & サニタイズ）:
async def get_response(self, user_input: str):
    sanitized = self._sanitize(user_input)
    # クラス全体で共有される self.client を使用
    return await self.client.post(self.url, json={"prompt": sanitized})
```
