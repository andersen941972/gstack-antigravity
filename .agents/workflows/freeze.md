---
description: freeze - Restrict file edits to a specific directory for the session. Blocks Edit and
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

# /freeze — Restrict Edits to a Directory

Lock file edits to a specific directory. Any Edit or Write operation targeting
a file outside the allowed path will be **blocked** (not just warned).

```bash
mkdir -p ~/.gstack/analytics
echo '{"skill":"freeze","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
```

## Setup

Ask the user which directory to restrict edits to. Use AskUserQuestion:

- Question: "Which directory should I restrict edits to? Files outside this path will be blocked from editing."
- Text input (not multiple choice) — the user types a path.

Once the user provides a directory path:

1. Resolve it to an absolute path:
```bash
FREEZE_DIR=$(cd "<user-provided-path>" 2>/dev/null && pwd)
echo "$FREEZE_DIR"
```

2. Ensure trailing slash and save to the freeze state file:
```bash
FREEZE_DIR="${FREEZE_DIR%/}/"
STATE_DIR="${CLAUDE_PLUGIN_DATA:-$HOME/.gstack}"
mkdir -p "$STATE_DIR"
echo "$FREEZE_DIR" > "$STATE_DIR/freeze-dir.txt"
echo "Freeze boundary set: $FREEZE_DIR"
```

Tell the user: "Edits are now restricted to `<path>/`. Any Edit or Write
outside this directory will be blocked. To change the boundary, run `/freeze`
again. To remove it, run `/unfreeze` or end the session."

## How it works

The hook reads `file_path` from the Edit/Write tool input JSON, then checks
whether the path starts with the freeze directory. If not, it returns
`permissionDecision: "deny"` to block the operation.

The freeze boundary persists for the session via the state file. The hook
script reads it on every Edit/Write invocation.

## Notes

- The trailing `/` on the freeze directory prevents `/src` from matching `/src-old`
- Freeze applies to Edit and Write tools only — Read, Bash, Glob, Grep are unaffected
- This prevents accidental edits, not a security boundary — Bash commands like `sed` can still modify files outside the boundary
- To deactivate, run `/unfreeze` or end the conversation