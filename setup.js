const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const GSTACK_DIR = path.join(ROOT_DIR, 'gstack');

/**
 * Finds the project root (superproject root if this is a submodule)
 */
/**
 * Finds the project root (superproject root if this is a submodule)
 * Robust version for multi-language (Polyglot) environments.
 */
function findProjectRoot() {
  try {
    // 1. Try getting the superproject root first (standard for submodules)
    const superRoot = execSync('git rev-parse --show-superproject-working-tree', { cwd: ROOT_DIR }).toString().trim();
    if (superRoot && fs.existsSync(superRoot)) {
      return superRoot;
    }
  } catch (e) {
    // git command failed or unsupported
  }

  // Fallback: search upwards for project signals
  let current = ROOT_DIR;
  let candidates = [];

  while (current !== path.parse(current).root) {
    const parent = path.resolve(current, '..');
    
    // Safety: Skip the adapter directory itself if it accidentally contains signs
    if (path.basename(parent) === 'gstack_antigravity') {
      current = parent;
      continue;
    }

    // A. Explicit Marker (Highest Priority)
    if (fs.existsSync(path.join(parent, 'project-root.txt')) || 
        fs.existsSync(path.join(parent, '.gstack-root'))) {
      return parent; 
    }

    // B. Polyglot & Generic signals
    const signals = [
      '.serena',        // Serena Antigravity
      'GEMINI.md',       // Antigravity Guideline
      'package.json',   // Node.js
      'requirements.txt', // Python
      'pyproject.toml',  // Python (Modern)
      'go.mod',         // Go
      '.vscode',        // VS Code Workspace
      '.git',           // Parent Git Repo (Directory)
    ];

    const foundSignal = signals.some(sig => {
      const p = path.join(parent, sig);
      if (!fs.existsSync(p)) return false;
      // .git must be a directory to be a parent root
      if (sig === '.git') return fs.lstatSync(p).isDirectory();
      return true;
    });

    if (foundSignal) {
      return parent; // Return the closest (deepest) root found
    }
    
    current = parent;
  }

  // Fallback to one level up as a safe default
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
const workflowDest = (PROJECT_ROOT === ROOT_DIR) 
  ? path.join(ROOT_DIR, '.agents', 'workflows')
  : path.join(PROJECT_ROOT, '.agents', 'workflows');

if (!fs.existsSync(workflowDest)) {
  fs.mkdirSync(workflowDest, { recursive: true });
}

try {
  // Pass workflowDest as a direct argument for maximum robustness on Windows
  execSync(`npm run build-skills -- "${workflowDest}"`, { 
    cwd: ROOT_DIR, 
    stdio: 'inherit'
  });
  console.log(`[✓] Workflow generation complete. (Dest: ${workflowDest})`);
} catch (e) {
  console.log('[!] Workflow generation failed.');
}

// 5. GEMINI.md Injector
console.log(`\n[Antigravity] Injecting routing rules to project root...`);
const adapterGeminiPath = path.join(ROOT_DIR, 'GEMINI.md');
const projectGeminiPath = path.join(PROJECT_ROOT, 'GEMINI.md');

if (fs.existsSync(adapterGeminiPath)) {
  const adapterGemini = fs.readFileSync(adapterGeminiPath, 'utf-8');
  // Extract everything from ## スキル・ルーティング to the end
  const routingMatch = adapterGemini.match(/(## スキル・ルーティング[\s\S]*)$/);
  
  if (routingMatch) {
    const routingContent = routingMatch[1].trim();
    
    if (fs.existsSync(projectGeminiPath)) {
      const projectGemini = fs.readFileSync(projectGeminiPath, 'utf-8');
      if (projectGemini.includes('GStack Workflow') || projectGemini.includes('invoke qa')) {
        console.log('[i] Routing rules or guidelines already present in GEMINI.md. Skipping.');
      } else {
        // Backup
        fs.writeFileSync(projectGeminiPath + '.bak', projectGemini);
        // Append
        fs.appendFileSync(projectGeminiPath, '\n\n' + routingContent + '\n');
        console.log(`[✓] Routing rules and guidelines appended to ${projectGeminiPath} (Backup created).`);
      }
    } else {
      // Create new
      const newGemini = `# Gemini Project Context\n\n${routingContent}\n`;
      fs.writeFileSync(projectGeminiPath, newGemini);
      console.log(`[✓] Created new GEMINI.md in ${PROJECT_ROOT} with routing rules and guidelines.`);
    }
  }
}

console.log('\n--- Setup Finished! ---');
console.log('Workflows are ready in .agents/workflows/');
console.log('For more details, see docs/WORKFLOWS_GUIDE.ja.md.');
