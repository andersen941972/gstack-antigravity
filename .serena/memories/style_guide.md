# Style and Conventions (Handover Guidelines)

## Core Rule: Repository Isolation
The `gstack/` directory is treated as a READ-ONLY source of truth.
Under no circumstances should any files within `gstack/` be modified or added to.
All conversions, adaptations, and project-specific logic must reside in the project root or its `src/` and `docs/` directories.

## Antigravity Adaptation Strategy
1. **Tool Independence**: Avoid using Bun or Node-based CLI tools for the actual "Agent workflow" (Markdown-based skill execution). Instead, use Antigravity's native tools.
2. **Workflow Guidelines**: All generated workflows in `.agents/workflows/` MUST contain:
    - A `description:` YAML frontmatter.
    - A `// turbo-all` annotation at the top (under the frontmatter).
    - An `Antigravity Browser Guidelines` section providing guidance on how to translate `$B` to `browser_subagent`.

## File Naming
- Conversion tools: `src/*.js`.
- Documentation: `docs/*.md`.
- Build results: `.agents/workflows/*.md`.
