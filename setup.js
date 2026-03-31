const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const GSTACK_DIR = path.join(ROOT_DIR, 'gstack');

console.log('--- Google Antigravity for Gstack Setup ---');

// 1. Check prerequisites
let hasBun = false;
try {
  execSync('bun --version', { stdio: 'ignore' });
  hasBun = true;
  console.log('[✓] Bun detected.');
} catch (e) {
  console.log('[!] Bun not detected. Gstack native binaries (browse daemon) cannot be built.');
  console.log('    To use full browser features, please install Bun from https://bun.sh/');
}

// 2. Gstack initialization
if (fs.existsSync(GSTACK_DIR)) {
  if (hasBun) {
    console.log('\n[Gstack] Installing dependencies and building...');
    try {
      execSync('bun install', { cwd: GSTACK_DIR, stdio: 'inherit' });
      execSync('bun run build', { cwd: GSTACK_DIR, stdio: 'inherit' });
      console.log('[✓] Gstack build complete.');
    } catch (e) {
      console.log('[!] Gstack build failed. You may need to run setup manually in the gstack/ directory.');
    }
  } else {
    console.log('\n[Gstack] Skipping build due to missing Bun.');
  }
} else {
  console.log('\n[!] Gstack directory not found. Please clone gstack first.');
  process.exit(1);
}

// 3. Workflow Conversion
console.log('\n[Antigravity] Generating workflows...');
try {
  execSync('npm run build-skills', { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log('[✓] Workflow generation complete.');
} catch (e) {
  console.log('[!] Workflow generation failed.');
}

console.log('\n--- Setup Finished! ---');
console.log('Generated workflows are available in .agents/workflows/');
console.log('To activate them, please copy or symlink .agents to your project root.');
console.log('For more details, see docs/WORKFLOWS_GUIDE.ja.md.');
