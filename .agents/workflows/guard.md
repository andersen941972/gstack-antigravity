---
name: guard
description: "Full safety mode: destructive command warnings + directory-scoped edits."
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

# /guard — Full Safety Mode

Activates both destructive command warnings and directory-scoped edit restrictions.
This is the combination of `/careful` + `/freeze` in a single command.

**Dependency note:** This skill references hook scripts from the sibling `/careful`
and `/freeze` skill directories. Both must be installed (they are installed together
by the gstack setup script).

```bash
mkdir -p ~/.gstack/analytics
echo '{"skill":"guard","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
```

## Setup

Ask the user which directory to restrict edits to. Use AskUserQuestion:

- Question: "Guard mode: which directory should edits be restricted to? Destructive command warnings are always on. Files outside the chosen path will be blocked from editing."
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

Tell the user:
- "**Guard mode active.** Two protections are now running:"
- "1. **Destructive command warnings** — rm -rf, DROP TABLE, force-push, etc. will warn before executing (you can override)"
- "2. **Edit boundary** — file edits restricted to `<path>/`. Edits outside this directory are blocked."
- "To remove the edit boundary, run `/unfreeze`. To deactivate everything, end the session."

## What's protected

See `/careful` for the full list of destructive command patterns and safe exceptions.
See `/freeze` for how edit boundary enforcement works.