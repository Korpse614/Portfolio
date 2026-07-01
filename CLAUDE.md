# Portfolio — Claude Instructions

## Stack
React 19 + TypeScript + Vite 8 (Rolldown bundler). Dev server: `npm run dev`.

## Adding a New Project

When the user asks to add a project, ask for these 6 things (anything not provided must be asked before touching code):

1. **Project name** — display label on the graph node
2. **Tag** — short badge label in the detail panel (e.g. "Web App", "Website", "CLI Tool", "Home Lab")
3. **Category** — which cluster it connects to: `web` | `homelab` | `creative`
4. **Status** — `Live` | `In Progress` | `Planned` | `Ongoing`
5. **Description** — 1–2 sentences for the detail panel
6. **Link** — optional external URL

Do not ask about `id`, `x`, `y` — derive the `id` from the name (lowercase, no spaces) and pick `x`/`y` coordinates that avoid overlapping existing nodes in the `0 0 1000 580` SVG viewBox.

### Where to edit
File: `src/pages/Projects.tsx`
Array: `const projects: Project[]` (around line 42)

### Existing node positions (avoid these areas)
| Project | x | y |
|---|---|---|
| Attendly | 110 | 160 |
| Balila Lebanese | 100 | 400 |
| Banyula | 320 | 470 |
| Rousscuts | 468 | 195 |
| DNS Sinkhole | 555 | 500 |
| Home Server Cluster | 875 | 455 |
| s2.media.au | 905 | 110 |
| GoatedContentPipeline | 635 | 70 |
| WEB DEV (cluster) | 300 | 270 |
| HOME LAB (cluster) | 700 | 395 |
| CREATIVE (cluster) | 740 | 165 |

### Status colours (already defined, do not add new ones)
- `Live` → red `#E82323`
- `In Progress` → amber `#F59E0B`
- `Planned` → grey `#6B7280`
- `Ongoing` → amber `#F59E0B`
