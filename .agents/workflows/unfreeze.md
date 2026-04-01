---
name: unfreeze
description: "Clear the freeze boundary set by /freeze, allowing edits to all directories"
---
// turbo-all

## 🌐 Antigravity Browser & Command Guidelines

### 🖥️ ブラウザ操作について
**CRITICAL:** 以下のドキュメントにはレガシーな `$B` コマンドによるブラウザ操作手順が記載されていますが、現在の環境では `$B` コマンドは使用しないでください。
代わりに、必ず組み込みの **`browser_subagent`** ツールを利用してください。
- `$B goto <url>` -> "指定のURLにアクセスする"
- `$B click @e3` や `$B fill ...` -> "該当の要素をクリックし、フォームを入力する"
- `$B snapshot / screenshot` -> `browser_subagent` は自動で状態を記録するため不要です。

### 🐚 Bashコマンド（Preamble等）の安全な実行方法
**CRITICAL:** 複数行のbashスクリプト（特に `Preamble` などのブロック）を `run_command` で実行する際、改行を消して1行に繋げてしまうと構文エラーで失敗します。
**絶対にそのまま1つのコマンド文字列として実行しないでください。**

**【必須手順】**
1. スクリプトのブロックをそのまま（改行を保持したまま）テキストとして `write_to_file` ツールを使用し、一時ファイル（例: `/tmp/gstack-preamble.sh` またはカレントディレクトリの `.gstack-temp.sh`）に保存してください。
2. その後、`run_command` で `bash /tmp/gstack-preamble.sh` を実行してください。
3. 実行後は `rm /tmp/gstack-preamble.sh` などで一時ファイルを削除して構いません。

---

<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /unfreeze — Clear Freeze Boundary

Remove the edit restriction set by `/freeze`, allowing edits to all directories.

```bash
mkdir -p ~/.gstack/analytics
echo '{"skill":"unfreeze","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
```

## Clear the boundary

```bash
STATE_DIR="${CLAUDE_PLUGIN_DATA:-$HOME/.gstack}"
if [ -f "$STATE_DIR/freeze-dir.txt" ]; then
  PREV=$(cat "$STATE_DIR/freeze-dir.txt")
  rm -f "$STATE_DIR/freeze-dir.txt"
  echo "Freeze boundary cleared (was: $PREV). Edits are now allowed everywhere."
else
  echo "No freeze boundary was set."
fi
```

Tell the user the result. Note that `/freeze` hooks are still registered for the
session — they will just allow everything since no state file exists. To re-freeze,
run `/freeze` again.