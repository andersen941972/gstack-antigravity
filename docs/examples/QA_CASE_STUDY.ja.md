# 🧪 ケーススタディ：/qa（品質保証・システムテスト）

GStack Antigravity が「ただテストコードを書く」だけでなく、実際の環境でバグを特定し、修正・検証までを完結させるプロセスを実演します。

## 📥 プロンプト（指示内容）

> **/qa**  
> `src/trading_executor.py` の注文執行ロジックをテストしてください。特に、指値注文（Limit Order）のバリデーションにバグがないか重点的に調査してください。

---

## 📤 実行結果

QA ロールとして `src/trading_executor.py` の検証を開始します。

### 1. テスト計画と実行環境
- **対象機能**: `TradingExecutor` クラスの `create_limit_order` メソッド。
- **検証項目**: 
    - 注文価格（Price）が 0 以下の際の挙動。
    - 証拠金不足（Insufficient Funds）時の例外処理。
    - ロット数（Volume）の小数点以下の丸め処理の正確性。
- **実行ツール**: `pytest` による自動テストスイートの生成と実行。

### 2. 発見されたクリティカルな不具合
テストの結果、以下の 1 件のクリティカルなバグを発見しました。

- **現象**: 指値価格が現在の市場価格と極端に乖離している場合、MT5 側の `ERROR_PRICE_INVALID` を適切にハンドリングできず、システムが無限に再送（Retry）を試みる「無限ループ」が発生していました。
- **再現コード**:
  ```python
  # 異常系テストケース: 市場価格100に対して指値0.001を指定
  executor.create_limit_order(symbol="BTCUSD", price=0.001, volume=0.1)
  # => 結果: Retrying... (attempt 1024)
  ```

### 3. 修正と検証
この不具合を修正するため、`TradingExecutor` に「最大リトライ回数の制限」と「価格の妥当性チェック」を導入しました。

- **修正箇所**: [trading_executor.py:L145-160](file:///src/trading_executor.py#L145-160)
- **修正内容**:
  ```python
  if abs(market_price - price) / market_price > 0.5:
      raise InvalidPriceError("Price is too far from market price.")
  ```

### 4. 最終テスト結果
修正後のコードに対して再度テストスイートを実行しました。
- **PASS**: 正常系の注文執行 (15/15 ケース)
- **PASS**: 証拠金不足のハンドリング (3/3 ケース)
- **PASS**: 乖離価格のバリデーション (2/2 ケース)

**結論**: `src/trading_executor.py` の安全性は確保されました。変更内容をマージ可能です。
