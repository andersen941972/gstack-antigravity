# 🔍 ケーススタディ：/investigate（バグ調査・原因究明）

GStack Antigravity が「起きてしまったエラー」に対し、どのようにスタックトレースを読み解き、根本原因に辿り着くかを実演します。

## 📥 プロンプト（指示内容）

> **/investigate**  
> `main.py` を実行すると `RuntimeError: MT5 backend disconnected` というエラーが出て停止します。ログを確認して原因を教えてください。

---

## 📤 実行結果

SRE ロールとしてエラーの調査を開始します。

### 1. エラーログの解析
直近の `logs/app.log` を確認したところ、以下のスタックトレースが記録されていました。
```python
File "src/data_fetcher.py", line 82, in fetch_rates
    rates = mt5.copy_rates_from_pos(symbol, timeframe, 0, count)
RuntimeError: terminal not initialized
```

### 2. 根本原因の特定
調査の結果、不具合の核心は以下の **「非同期化による初期化漏れ」** であることが判明しました。

- **詳細**: `main.py` のループ処理が並列化された際、`data_fetcher` が `mt5.initialize()` の完了を待たずに `copy_rates_from_pos` を呼び出していました。
- **場所**: [main.py:L12-45](file:///main.py#L12-45)
- **原因**: Await キーワードの欠如により、MT5 バックエンドへの接続が確立される前にポーリングが開始されていました。

### 3. 解決策と再発防止策
#### 短期的な修正
`main.py` の初期化ブロックに明確なウェイト（待機）とリトライロジックを挿入します。

#### 中長期的な再発防止（SRE 視点）
- **コネクションプールの導入**: `mt5_manager.py` を作成し、常に接続状態を監視（Health Check）するシングルトン・マネージャー経由で API を叩くようにリファクタリングすることを推奨します。

### 4. 実行後の改善案
```python
# 提案する Health Check ロジックの導入
if not mt5.terminal_info():
    await self.reconnect()
```
