const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const GSTACK_DIR = path.join(ROOT_DIR, 'gstack');
const PARENT_DIR = path.resolve(ROOT_DIR, '..');

console.log('--- Google Antigravity for Gstack Setup ---');

// 1. Git Submodule Initialization
if (!fs.existsSync(path.join(GSTACK_DIR, 'SKILL.md'))) {
  console.log('\n[Git] Gstack submodule appears to be empty. Initializing...');
  try {
    execSync('git submodule update --init --recursive', { cwd: ROOT_DIR, stdio: 'inherit' });
    console.log('[✓] Submodules initialized.');
  } catch (e) {
    console.log('[!] Git submodule initialization failed. Please run it manually.');
  }
}

// 2. Check prerequisites (Bun)
let hasBun = false;
try {
  execSync('bun --version', { stdio: 'ignore' });
  hasBun = true;
  console.log('[✓] Bun detected.');
} catch (e) {
  console.log('[!] Bun not detected. Gstack native binaries (browse daemon) cannot be built.');
  console.log('    To use full browser features, please install Bun from https://bun.sh/');
}

// 3. Gstack Build
if (fs.existsSync(GSTACK_DIR)) {
  if (hasBun) {
    console.log('\n[Gstack] Installing dependencies and building...');
    try {
      execSync('bun install', { cwd: GSTACK_DIR, stdio: 'inherit' });
      execSync('bun run build', { cwd: GSTACK_DIR, stdio: 'inherit' });
      console.log('[✓] Gstack build complete.');
    } catch (e) {
      console.log('[!] Gstack build failed.');
    }
  } else {
    console.log('\n[Gstack] Skipping build due to missing Bun.');
  }
}

// 4. Workflow Conversion
console.log('\n[Antigravity] Generating workflows...');
try {
  execSync('npm run build-skills', { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log('[✓] Workflow generation complete.');
} catch (e) {
  console.log('[!] Workflow generation failed.');
}

// 5. GEMINI.md Injector
console.log('\n[Antigravity] Injecting routing rules to parent project...');
const adapterGeminiPath = path.join(ROOT_DIR, 'GEMINI.md');
const parentGeminiPath = path.join(PARENT_DIR, 'GEMINI.md');

if (fs.existsSync(adapterGeminiPath)) {
  const adapterGemini = fs.readFileSync(adapterGeminiPath, 'utf-8');
  // Extract Skill Routing section (from ## スキル・ルーティング to before the next ##)
  const routingMatch = adapterGemini.match(/(## スキル・ルーティング[\s\S]*?)(?=##|$)/);
  
  if (routingMatch) {
    const routingContent = routingMatch[1].trim();
    
    if (fs.existsSync(parentGeminiPath)) {
      const parentGemini = fs.readFileSync(parentGeminiPath, 'utf-8');
      if (parentGemini.includes('invoke qa') || parentGemini.includes('invoke review')) {
        console.log('[i] Routing rules already present in parent GEMINI.md. Skipping.');
      } else {
        // Backup
        fs.writeFileSync(parentGeminiPath + '.bak', parentGemini);
        // Append
        fs.appendFileSync(parentGeminiPath, '\n\n' + routingContent + '\n');
        console.log('[✓] Routing rules appended to parent GEMINI.md (Backup created).');
      }
    } else {
      // Create new
      const newGemini = `# Gemini Project Context\n\n${routingContent}\n`;
      fs.writeFileSync(parentGeminiPath, newGemini);
      console.log('[✓] Created new GEMINI.md in parent project with routing rules.');
    }
  }
}

console.log('\n--- Setup Finished! ---');
console.log('Workflows are ready in .agents/workflows/');
console.log('For more details, see docs/WORKFLOWS_GUIDE.ja.md.');
