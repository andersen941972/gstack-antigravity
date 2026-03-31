---
description: careful - Safety guardrails for destructive commands. Warns before rm -rf, DROP TABLE,
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

# /careful — Destructive Command Guardrails

Safety mode is now **active**. Every bash command will be checked for destructive
patterns before running. If a destructive command is detected, you'll be warned
and can choose to proceed or cancel.

```bash
mkdir -p ~/.gstack/analytics
echo '{"skill":"careful","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
```

## What's protected

| Pattern | Example | Risk |
|---------|---------|------|
| `rm -rf` / `rm -r` / `rm --recursive` | `rm -rf /var/data` | Recursive delete |
| `DROP TABLE` / `DROP DATABASE` | `DROP TABLE users;` | Data loss |
| `TRUNCATE` | `TRUNCATE orders;` | Data loss |
| `git push --force` / `-f` | `git push -f origin main` | History rewrite |
| `git reset --hard` | `git reset --hard HEAD~3` | Uncommitted work loss |
| `git checkout .` / `git restore .` | `git checkout .` | Uncommitted work loss |
| `kubectl delete` | `kubectl delete pod` | Production impact |
| `docker rm -f` / `docker system prune` | `docker system prune -a` | Container/image loss |

## Safe exceptions

These patterns are allowed without warning:
- `rm -rf node_modules` / `.next` / `dist` / `__pycache__` / `.cache` / `build` / `.turbo` / `coverage`

## How it works

The hook reads the command from the tool input JSON, checks it against the
patterns above, and returns `permissionDecision: "ask"` with a warning message
if a match is found. You can always override the warning and proceed.

To deactivate, end the conversation or start a new one. Hooks are session-scoped.