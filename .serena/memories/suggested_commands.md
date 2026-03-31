# Suggested Commands

### 1. Initialization
`npm run setup`
Runs `setup.js`, which ensures `gstack/` dependencies are resolved, builds browser binaries (if Bun is available), and generates initial Antigravity workflows.

### 2. Workflow Sync
`npm run build-skills`
Updates the `.agents/workflows/*.md` files based on the contents of the `gstack/` directory. Use this after updating `gstack` or modifying conversion settings in `src/convert-skills.js`.

### 3. Cleanup
`git clean -fd .agents/workflows` (if gitified)
Deletes all generated workflows. Use `npm run build-skills` to recreate them.
