const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const GSTACK_DIR = path.join(ROOT_DIR, 'gstack');

/**
 * Finds the project root (superproject root if this is a submodule)
 */
function findProjectRoot() {
  try {
    // Try getting the superproject root first (standard for submodules)
    const superRoot = execSync('git rev-parse --show-superproject-working-tree', { cwd: ROOT_DIR }).toString().trim();
    if (superRoot) return superRoot;
  } catch (e) {
    // git command failed or unsupported
  }

  // Fallback: search upwards for the first .git directory
  let current = ROOT_DIR;
  while (current !== path.parse(current).root) {
    const parent = path.resolve(current, '..');
    if (fs.existsSync(path.join(parent, '.git'))) {
      return parent;
    }
    current = parent;
  }

  // Default to one level up if all else fails
  return path.resolve(ROOT_DIR, '..');
}

const PROJECT_ROOT = findProjectRoot();
console.log('--- Google Antigravity for Gstack Setup ---');
console.log(`[i] Target project root: ${PROJECT_ROOT}`);

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
console.log(`\n[Antigravity] Injecting routing rules to project root...`);
const adapterGeminiPath = path.join(ROOT_DIR, 'GEMINI.md');
const projectGeminiPath = path.join(PROJECT_ROOT, 'GEMINI.md');

if (fs.existsSync(adapterGeminiPath)) {
  const adapterGemini = fs.readFileSync(adapterGeminiPath, 'utf-8');
  const routingMatch = adapterGemini.match(/(## スキル・ルーティング[\s\S]*?)(?=##|$)/);
  
  if (routingMatch) {
    const routingContent = routingMatch[1].trim();
    
    if (fs.existsSync(projectGeminiPath)) {
      const projectGemini = fs.readFileSync(projectGeminiPath, 'utf-8');
      if (projectGemini.includes('invoke qa') || projectGemini.includes('invoke review')) {
        console.log('[i] Routing rules already present in GEMINI.md. Skipping.');
      } else {
        // Backup
        fs.writeFileSync(projectGeminiPath + '.bak', projectGemini);
        // Append
        fs.appendFileSync(projectGeminiPath, '\n\n' + routingContent + '\n');
        console.log(`[✓] Routing rules appended to ${projectGeminiPath} (Backup created).`);
      }
    } else {
      // Create new
      const newGemini = `# Gemini Project Context\n\n${routingContent}\n`;
      fs.writeFileSync(projectGeminiPath, newGemini);
      console.log(`[✓] Created new GEMINI.md in ${PROJECT_ROOT} with routing rules.`);
    }
  }
}

console.log('\n--- Setup Finished! ---');
console.log('Workflows are ready in .agents/workflows/');
console.log('For more details, see docs/WORKFLOWS_GUIDE.ja.md.');
