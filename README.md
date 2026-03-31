# GStack Antigravity 🚀
*(Google Antigravity Adapter for Garry Tan's GStack)*

This project is an unofficial adapter/wrapper created to seamlessly integrate [**gstack**](https://github.com/garrytan/gstack)—the incredible open-source AI builder framework by Garry Tan—into the **Google Antigravity** ecosystem (Claude Code / Serena MCP).

**✨ Autonomously Created by AI ✨**  
From early conceptual analysis and architecture design, down to coding and full autonomous testing, this entire adapter was **built entirely by Google Antigravity itself**. It acts as a rare example of an AI autonomously adapting and optimizing tools to rapidly improve its own engineering capabilities.

**🙏 Utmost Respect and Gratitude for the Original**  
We have profound respect for the original `gstack` vision: systematizing complex software engineering concepts and truly empowering builders through beautifully crafted, top-tier prompt designs. Taking Garry Tan's empowering ethos "**MIT. Free forever. Go build something.**" to heart, we created this derivative project which is also fully open-sourced under the MIT License.

---

## 💡 Project Purpose & Architecture

GStack provides incredible AI engineering workflows like `/qa`, `/autoplan`, and `/review`. However, it natively relies on specific CLI assumptions and local binaries (like the Bun-based `gstack-browse` daemon).

This adapter brings those workflows to Antigravity using the **"Non-polluting Principle"**:

1. **Read-Only Upstream**: The original `gstack/` directory is treated strictly as read-only material (like a git submodule). We never pollute the upstream source.
2. **Browser Subagent Delegation**: Legacy `$B` (browse) commands are automatically injected with translation guidelines, allowing Antigravity's native, powerful `browser_subagent` to autonomously navigate and test UIs using Natural Language Tasks.
3. **Path Localization**: Hardcoded global config paths are intelligently resolved to project-relative paths via regex replacement, making it 100% compatible natively even on Windows environments (pwsh/bash).
4. **Autonomous Execution**: Using the injected `// turbo-all` annotation, Antigravity executes these converted workflows completely autonomously under the `.agents/workflows/` schema.

---

## ⚙️ Getting Started

### 1. Project-Level Installation (Recommended)
Since AI behavior (prompts, skill routing, learnings) is inherently domain-specific, we highly recommend integrating this adapter **per-project (at the directory level)**.

Navigate to your target project (e.g., `project-example/`) and add this repository as a Git Submodule. 
*(Note: You can place this submodule in any directory like `tools`, `vendor`, or `scripts`. The internal setup script dynamically resolves all absolute paths, so there is **zero risk of breakage** regardless of what you name the folder. We use `tools/` in this example. If your project is not yet a Git repository, run `git init` first.)*

```bash
# If you haven't initialized git in your project yet:
git init

# Add the submodule:
git submodule add https://github.com/andersen941972/gstack-antigravity.git tools/gstack_antigravity
```

### 2. Run Setup Scripts
Navigate into the newly added submodule directory and run the environment setup script. This resolves dependencies, fetches the original GStack submodule, and bakes the exact absolute paths of your chosen directory into the workflows.

```bash
cd tools/gstack_antigravity
```
- **Windows**: Double-click `setup.bat` or run `.\setup.bat`
- **macOS / Linux**: Run `bash setup.sh`

### 3. Expose Workflows
If successful, the setup creates a `.agents/workflows/` directory. To activate these for your main project, either copy or symlink the folder to the root of your project (`project-example/`).

```bash
# Example: Copy the workflows to the project root
cd ../.. # Go back to the root of project-example
cp -r tools/gstack_antigravity/.agents .
```
No restart is required! Antigravity will automatically detect the `.agents/workflows/` directory. Your AI engineering slash commands are now fully operational for this project.

### 4. Using Workflows
Open your Antigravity-supported environment or terminal. Simply type a slash command (followed by your query if needed) to unleash the agent!

- **`/qa [URL]`** : Let the subagent systematically navigate, test, and find bugs in your UI visually without manual scraping.
- **`/review`** : Analyze your uncommitted changes (or git diff) simulating a rigorous Senior Engineer checking for SQL safety, LLM trust boundaries, and concurrency issues.
- **`/autoplan`** : Trigger an autonomous deliberation pipeline representing CEO, Design, and Engineering reviews to validate any complex feature idea before coding.

---

## 🚀 Available Workflows (Slash Commands)

Simply type these commands in your Antigravity-supported chat prompt to unleash advanced autonomous workflows from GStack.

| Command | Description |
| :--- | :--- |
| `/autoplan` | **Auto-review Pipeline**: Conducts deep deliberation from CEO, Design, and Engineering perspectives before you start coding. |
| `/review` | **PR Review**: Analyzes your code diff through the eyes of a Senior Engineer for SQL safety, logic bugs, and trust boundaries. |
| `/qa` | **Autonomous QA**: Let the subagent systematically navigate, test, and fix bugs in your UI using the browser subagent. |
| `/qa-only` | **Report-only QA**: Runs the same systematic tests as `/qa` but only produces a report without attempting fixes. |
| `/plan-ceo-review` | **CEO Mode**: Rethinks the plan with focus on product strategy and "10-star" user experiences. |
| `/plan-design-review` | **Design Review**: Evaluates the plan for UI/UX consistency, micro-animations, and modern aesthetics. |
| `/plan-eng-review` | **Engineering Review**: Locks in the technical execution plan, focusing on architecture and testability. |
| `/benchmark` | **Perf Benchmarking**: Detects performance regressions using multiple browser-led test passes. |
| `/canary` | **Canary Monitoring**: Watches your live application post-deploy for console errors and unexpected behavior. |
| `/careful` | **Safety Guardrails**: Provides interactive warnings before executing potentially destructive commands like `rm -rf`. |
| `/freeze` | **Directory Freeze**: Restricts the AI's file edits to a specific directory boundary for the current session. |
| `/unfreeze` | **Clear Boundary**: Lift the edit restrictions set by the `/freeze` command. |
| `/learn` | **Learning Management**: Review, search, prune, and export specific project insights ("Learnings"). |
| `/retro` | **Weekly Retrospective**: Analyzes your commit history and workflow patterns for an engineering review. |
| `/browse` / `/gstack` | **Browser Tools**: Quick headless browser launching for manual or autonomous site dogfooding. |
| `/connect-chrome` | **Real Chrome Integration**: Connects to your real Chromium browser with the side panel extension loaded. |
| `/setup-browser-cookies` | **Cookie Sync**: Imports session cookies from your browser to bypass auth in headless testing. |
| `/land-and-deploy` | **Deployment Flow**: Automates merging PRs, waiting for CI, and shipping to production. |
| `/setup-deploy` | **Deploy Config**: Interactive setup for your target deployment environment for `/land-and-deploy`. |
| `/document-release` | **Auto Documentation**: Updates project-wide docs and READMEs automatically after a successful release. |
| `/gstack-upgrade` | **Core Upgrade**: Checks for and performs a safe upgrade of the underlying GStack core. |

---

## 📂 Repository Structure

- `gstack/` - Original gstack definitions (Read-only, do not modify)
- `src/` - The core adapter/translation scripts
- `.agents/workflows/` - The compiled Antigravity AI Workflows
- `docs/` - Analysis results, plans, and historical logs

---

## 🤝 Contributing

We want to empower builders to make something people want. 
Pull Requests, issues, and ideas are welcome. To understand the foundational philosophy and mastery behind these workflows, please refer back to the [original GStack repository](https://github.com/garrytan/gstack).

## 📜 License

This project, like the original, is licensed under the [MIT License](LICENSE).
**Free forever. Go build something.**
