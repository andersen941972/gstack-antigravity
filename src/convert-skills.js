const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const GSTACK_DIR = path.join(ROOT_DIR, 'gstack');
const OUTPUT_DIR = path.join(ROOT_DIR, '.agents', 'workflows');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function extractFrontmatter(content) {
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return { fm: '', body: content, name: '', description: '' };

    const fm = fmMatch[1];
    const body = content.slice(fmMatch[0].length).trim();

    const nameMatch = fm.match(/^name:\s*(.+)$/m);
    const name = nameMatch ? nameMatch[1].trim() : '';

    // Description can be multi-line
    let description = '';
    const descMatch = fm.match(/^description:\s*(?:\|?\s*\n([\s\S]*?)(?=\n\w+:|$)|(.+)$)/m);
    if (descMatch) {
        description = (descMatch[1] || descMatch[2] || '').trim();
        // Clean up leading spaces if it was a block scalar
        description = description.split('\n').map(line => line.replace(/^\s{2}/, '')).join(' ').replace(/\s+/g, ' ');
    }

    return { fm, body, name, description };
}

function convert() {
    console.log(`Searching for SKILL.md in ${GSTACK_DIR}...`);
    
    // Process root SKILL.md
    const rootSkill = path.join(GSTACK_DIR, 'SKILL.md');
    if (fs.existsSync(rootSkill)) {
        processFile(rootSkill, 'gstack');
    }

    const entries = fs.readdirSync(GSTACK_DIR, { withFileTypes: true });

    entries.forEach(entry => {
        if (!entry.isDirectory() || entry.name.startsWith('.')) return;

        const skillFile = path.join(GSTACK_DIR, entry.name, 'SKILL.md');
        if (fs.existsSync(skillFile)) {
            processFile(skillFile, entry.name);
        }
    });

    console.log('Conversion complete!');
}

function processFile(filePath, skillName) {
    console.log(`Processing ${skillName}...`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { name, description, body } = extractFrontmatter(content);

    const finalName = name || skillName;
    const finalDescription = description || `Gstack skill for ${finalName}`;

    // Replace legacy paths and local ./gstack paths with the project's dynamically resolved local installation path
    const LOCAL_GSTACK_PATH = path.join(__dirname, '..', 'gstack/').replace(/\\/g, '/');
    
    let processedBody = body
        .replace(/~\/\.claude\/skills\/gstack\//g, LOCAL_GSTACK_PATH)
        .replace(/\.\/gstack\//g, LOCAL_GSTACK_PATH)
        .replace(/CLAUDE\.md/g, 'GEMINI.md');

    const guideline = `## 🌐 Antigravity Browser & Command Guidelines

### 🖥️ ブラウザ操作について
**CRITICAL:** 以下のドキュメントにはレガシーな \`$B\` コマンドによるブラウザ操作手順が記載されていますが、現在の環境では \`$B\` コマンドは使用しないでください。
代わりに、必ず組み込みの **\`browser_subagent\`** ツールを利用してください。
- \`$B goto <url>\` -> "指定のURLにアクセスする"
- \`$B click @e3\` や \`$B fill ...\` -> "該当の要素をクリックし、フォームを入力する"
- \`$B snapshot / screenshot\` -> \`browser_subagent\` は自動で状態を記録するため不要です。

### 🐚 Bashコマンド（Preamble等）の安全な実行方法
**CRITICAL:** 複数行のbashスクリプト（特に \`Preamble\` などのブロック）を \`run_command\` で実行する際、改行を消して1行に繋げてしまうと構文エラーで失敗します。
**絶対にそのまま1つのコマンド文字列として実行しないでください。**

**【必須手順】**
1. スクリプトのブロックをそのまま（改行を保持したまま）テキストとして \`write_to_file\` ツールを使用し、一時ファイル（例: \`/tmp/gstack-preamble.sh\` またはカレントディレクトリの \`.gstack-temp.sh\`）に保存してください。
2. その後、\`run_command\` で \`bash /tmp/gstack-preamble.sh\` を実行してください。
3. 実行後は \`rm /tmp/gstack-preamble.sh\` などで一時ファイルを削除して構いません。

---

`;

    const outputContent = `---
description: ${finalName} - ${finalDescription}
---
// turbo-all

${guideline}${processedBody}`;


    const outputPath = path.join(OUTPUT_DIR, `${skillName}.md`);
    fs.writeFileSync(outputPath, outputContent);
    console.log(`Saved to ${outputPath}`);
}

convert();
