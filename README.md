# Obsidian1

A **local-first, extensible knowledge management web application** inspired by [Obsidian](https://obsidian.md). Built with Next.js 15, CodeMirror 6, and modern web technologies.

> **Status:** 🚧 Active Development — MVP Phase

## ✨ Features

### Core
- 📝 **Professional Markdown Editor** — CodeMirror 6 with Live Preview, Source, and Reading modes
- 🔗 **Bi-directional Linking** — `[[Wikilinks]]` with autocomplete, backlinks, and unlinked mention detection
- 🌐 **Knowledge Graph** — Interactive force-directed graph visualization (d3-force + WebGL)
- 🗂️ **File Explorer** — Recursive folder tree with drag-and-drop, context menus, and search
- ⌨️ **Command Palette** — `Cmd+P` fuzzy launcher for every action
- 🔀 **Quick Switcher** — `Cmd+O` instant file fuzzy search
- 📊 **Outline View** — Auto-generated table of contents from headings
- 🏷️ **Properties Editor** — Visual YAML frontmatter editing with typed fields

### Editor Extensions
- ✅ Interactive checkboxes (`- [ ]` / `- [x]`)
- 📐 LaTeX math rendering (KaTeX)
- 📊 Mermaid diagram rendering
- 💬 Callouts / Admonitions (`> [!NOTE]`, `> [!WARNING]`, etc.)
- 📎 Transclusion / Embeds (`![[Note]]`)

### Architecture
- 🏠 **Local-First** — Files stored on disk via File System Access API (no cloud required)
- 🌙 **Dark/Light Theming** — Obsidian-inspired color palette with CSS custom properties
- 🪟 **Flexible Workspace** — Resizable 3-column layout with split panes and tabs
- ⚡ **Web Worker Search** — Sub-millisecond full-text fuzzy search via MiniSearch

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript 5.5 |
| Editor | CodeMirror 6 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State | Zustand |
| Storage | File System Access API + IndexedDB (Dexie.js) |
| Search | MiniSearch (Web Worker) |
| Graph | d3-force + react-force-graph-2d |
| Math | KaTeX |
| Diagrams | Mermaid.js |

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/parth2024-tech/obsidian1.git
cd obsidian1

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── vault/              # Main workspace (after vault is opened)
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Vault selector landing page
│   └── globals.css         # Global styles & theme variables
├── components/
│   ├── editor/             # CodeMirror 6 editor & extensions
│   ├── file-explorer/      # File tree sidebar
│   ├── graph/              # Knowledge graph visualization
│   ├── panels/             # Backlinks, Outline, Properties panels
│   ├── ui/                 # shadcn/ui primitives
│   └── workspace/          # Shell: ribbon, sidebars, tabs, status bar
├── lib/
│   ├── vault/              # Core engine: filesystem, metadata cache, search
│   ├── themes.ts           # Theme definitions
│   └── utils.ts            # Shared utilities
├── stores/                 # Zustand reactive stores
└── workers/                # Web Workers (search, graph physics)
```

## 🗺️ Roadmap

- [x] Project scaffolding & architecture
- [ ] Core data layer (vault filesystem, metadata cache)
- [ ] CodeMirror 6 editor with wikilinks & live preview
- [ ] 3-column workspace layout
- [ ] Graph view
- [ ] Canvas (JSON Canvas v1.0)
- [ ] Plugin system
- [ ] Cloud sync (CRDTs / Yjs)
- [ ] Mobile PWA

## 📄 License

MIT