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

### 1. Setup
Clone the repository and run the setup script.
(Requires Node.js for the build runners)

```bash
npm run setup
```
- This triggers internal dependency builds (if `bun` is present) and automatically funnels the original skills through `src/convert-skills.js`, outputting the transformed MD files into `.agents/workflows/`.

### 2. Using Workflows
Open your Antigravity-supported environment or terminal. Simply type a slash command (followed by your query if needed) to unleash the agent!

- **`/qa [URL]`** : Let the subagent systematically navigate, test, and find bugs in your UI visually without manual scraping.
- **`/review`** : Analyze your uncommitted changes (or git diff) simulating a rigorous Senior Engineer checking for SQL safety, LLM trust boundaries, and concurrency issues.
- **`/autoplan`** : Trigger an autonomous deliberation pipeline representing CEO, Design, and Engineering reviews to validate any complex feature idea before coding.

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
