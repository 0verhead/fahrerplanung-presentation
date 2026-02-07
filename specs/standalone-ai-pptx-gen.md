---
id: standalone-ai-pptx-gen
title: standalone-ai-pptx-gen
status: in-progress
priority: high
created: 2026-02-07T00:00:00.000Z
updated: 2026-02-07T04:05:00.000Z
---

## Summary

Encore is a standalone Electron desktop app that provides a Cursor-like AI-powered experience for creating PowerPoint presentations. Built on the Vercel AI SDK (v6) for agent orchestration, it lets users interact via chat while the AI writes React-PPTX JSX code compiled to `.pptx` in real-time — with live slide preview, an editable code editor, multi-provider LLM support (OpenRouter default), and the `frontend-design` skill embedded in both the app UI and the AI's generation behavior.

## Dependency Versions (latest compatible as of Feb 2026)

### Core Framework

| Package | Version | Notes |
|---|---|---|
| `electron` | `40.2.1` | Latest stable, Chromium 134, Node 22 |
| `electron-vite` | `5.0.0` | Vite-based Electron build tool, supports Vite 5/6/7 |
| `vite` | `7.3.1` | Latest, requires Node >=20.19.0 or >=22.12.0 |
| `typescript` | `5.9.3` | Latest stable |
| `react` | `19.2.4` | Latest (v19 for renderer) |
| `react-dom` | `19.2.4` | Matches React version |

### AI / Agent Framework

| Package | Version | Notes |
|---|---|---|
| `ai` (Vercel AI SDK) | `6.0.75` | Latest v6, streaming + tool-calling + `maxSteps` |
| `@openrouter/ai-sdk-provider` | `2.1.1` | OpenRouter provider for AI SDK v6 |
| `@ai-sdk/anthropic` | `3.0.38` | Direct Anthropic provider |
| `@ai-sdk/openai` | `3.0.26` | Direct OpenAI provider |
| `zod` | `3.25.76` | Required by AI SDK v6 for tool schemas (v4 also compatible but v3 is safer for ecosystem) |

### Editor & UI

| Package | Version | Notes |
|---|---|---|
| `monaco-editor` | `0.55.1` | Latest VS Code editor engine |
| `@monaco-editor/react` | `4.7.0` | React wrapper, supports React 19 |
| `tailwindcss` | `4.1.18` | Latest v4 (CSS-first config) |
| `zustand` | `5.0.11` | State management, supports React 19 |
| `react-markdown` | `10.1.0` | Chat markdown rendering, supports React 19 |

### PPTX Generation (existing, kept)

| Package | Version | Notes |
|---|---|---|
| `pptxgenjs` | `3.12.0` | Keep current version in react-pptx-extended (v4.0.1 exists but requires testing fork compatibility) |
| `react-pptx-extended` | `workspace:*` | Local fork, no version change |

### Build & Tooling

| Package | Version | Notes |
|---|---|---|
| `esbuild` | `0.27.3` | TSX transpilation in compilation engine |
| `@electron-toolkit/utils` | `4.0.0` | Electron main process utilities |
| `@electron-toolkit/preload` | `3.0.2` | Preload script utilities |

### Compatibility Notes

- React 19.2.4 is used for the Electron renderer UI. The existing `react-pptx-extended` package uses React 18 as a peer dep — the compilation engine runs in a separate context so this is isolated.
- AI SDK v6 requires `zod >=3.25.76` — we use `3.25.76` for maximum ecosystem compatibility (not Zod v4 yet).
- `electron-vite@5.0.0` supports `vite ^5 || ^6 || ^7` — we use Vite 7.3.1.
- `pptxgenjs` stays at 3.12.0 within the fork to avoid breaking changes; upgrade to 4.0.1 can be a separate task after validating the fork.

## How the `frontend-design` Skill Applies

**Layer 1 — Encore's own app UI:** The Electron app follows the skill's guidelines — distinctive typography, bold cohesive aesthetic, atmospheric backgrounds, purposeful motion, no generic boilerplate look.

**Layer 2 — AI-generated presentations:** The AI system prompt embeds the skill so every generated deck uses distinctive fonts, atmospheric backgrounds, unexpected spatial composition, proper depth/shadows, and a clear "hero moment" per slide. No generic "corporate PowerPoint" output.

## Agent Framework — Vercel AI SDK v6

### Why Vercel AI SDK

- TypeScript-native, first-class streaming + tool-calling
- Built-in provider adapters for OpenRouter, Anthropic, OpenAI
- `maxSteps` for autonomous multi-step agent loops
- `useChat()` React hook for streaming chat UI
- Zod-typed tools with validated inputs/outputs
- Battle-tested in production (powers v0 and similar apps)

### Agent Loop

1. User message enters via `useChat()` hook
2. `streamText()` sends to AI with system prompt + conversation history + tools
3. AI streams text (shown in chat) and/or calls tools
4. Tools execute (write code, compile PPTX, read files, web search)
5. Tool results feed back to AI automatically
6. `maxSteps` allows the AI to chain: plan -> write TSX -> compile -> verify preview -> adjust — without user intervention
7. Loop completes when AI is satisfied or asks user for feedback

### Tool Definitions (Zod-typed)

- `write_presentation_code` — Create or overwrite the full `.tsx` source
- `edit_presentation_code` — Apply targeted edits to specific lines/sections (granular, like Cursor's apply)
- `compile_pptx` — Trigger TSX -> PPTX compilation, returns slide count + per-slide PNG thumbnails
- `read_local_file` — Read user files (images, PDFs, CSVs, docs) for content extraction
- `web_search` — Search the web for content, images, data, inspiration
- `fetch_image` — Download an image URL and return as base64 for embedding in slides

### Provider Configuration

- Default: `createOpenRouter({ apiKey })` — access to Claude, GPT-4, Gemini, Llama, etc.
- Optional: `createAnthropic({ apiKey })`, `createOpenAI({ apiKey })` for direct access
- Switchable per session via settings UI

### Conversation Memory

- Full `CoreMessage[]` history maintained per session
- Tool call/result pairs preserved for context continuity
- Current TSX state injected as context so AI always knows the presentation's current state
- Sessions persist to disk for project save/load

## Architecture

```
+-----------------------------------------------------+
|                   Electron Shell                     |
|  +----------+------------------+------------------+  |
|  |  Chat    |  Code Editor     |  Slide Preview   |  |
|  |  Panel   |  (Monaco 0.55)   |  (PNG renders)   |  |
|  |          |                  |                  |  |
|  |  User <> |  .tsx source     |  Live preview    |  |
|  |  AI      |  (AI + user      |  of compiled     |  |
|  |  convo   |   editable)      |  slides          |  |
|  +----------+------------------+------------------+  |
|  +------------------------------------------------+  |
|  |  Status Bar: model, tokens, generation status  |  |
|  +------------------------------------------------+  |
+-----------------------------------------------------+
         |                    |
         v                    v
   AI Provider            react-pptx-extended
   (OpenRouter)           -> pptxgenjs -> .pptx
```

## Tasks

- [x] **Project scaffolding** — Initialize Electron + React app under `app/` using `electron-vite@5.0.0`. Set up with Electron 40, Vite 7, React 19, TypeScript 5.9. Configure monorepo workspaces to include `packages/react-pptx-extended`.
- [ ] **App UI design system (frontend-design skill)** — Design Encore's own interface with Tailwind CSS 4.1. Apply the skill: bold aesthetic direction, distinctive typography (loaded via `@fontsource/*`), cohesive color system via CSS variables, atmospheric backgrounds, purposeful motion. Create design tokens.
- [ ] **Vercel AI SDK integration** — Install `ai@6.0.75`, `@openrouter/ai-sdk-provider@2.1.1`, `@ai-sdk/anthropic@3.0.38`, `@ai-sdk/openai@3.0.26`, `zod@3.25.76`. Set up `streamText()` pipeline in main process with provider registry. Bridge to renderer via Electron IPC for `useChat()`.
- [ ] **AI system prompt** — Craft the prompt embedding: react-pptx-extended API reference (all components, props, types), the full `frontend-design` SKILL.md principles, theme token conventions, design best practices from AGENTS.md, tool-use instructions, and presentation structure guidelines.
- [ ] **AI tool definitions** — Implement Zod-typed tools: `write_presentation_code`, `edit_presentation_code`, `compile_pptx`, `read_local_file`, `web_search`, `fetch_image`. Each with proper input schemas, execution handlers, and structured result types.
- [ ] **Multi-step agent loop** — Configure `maxSteps` for autonomous chaining. AI should be able to: analyze user request -> plan design direction -> write TSX -> compile -> check slide previews -> self-correct issues -> present final result. Handle tool errors gracefully with retry logic.
- [ ] **Chat panel** — Build conversation UI with `useChat()` and `react-markdown@10.1.0`: message list, markdown rendering, code blocks, streaming response display, tool-call status indicators ("Compiling slides...", "Reading file..."), input box. Style per app design system with Tailwind 4.
- [ ] **Code editor panel** — Integrate `@monaco-editor/react@4.7.0` with `monaco-editor@0.55.1`. TSX syntax highlighting, sync with AI-written code, user-editable. Diff view for AI changes. Cursor-like accept/reject for AI edits.
- [ ] **Slide preview panel** — Render compiled slide PNGs. Auto-update on recompilation. Zoom, slide navigation, error display. Styled with app design system.
- [ ] **Panel layout & micro-interactions** — Resizable three-panel layout with Cursor-like code panel toggle. Motion via CSS transitions/animations. Follow frontend-design skill for spatial composition.
- [ ] **PPTX compilation engine** — Wrap `react-pptx-extended` render pipeline. TSX string -> transpile via `esbuild@0.27.3` -> execute in sandboxed context with React 18 (isolated from app's React 19) -> render to PPTX Buffer + per-slide PNGs. Worker/subprocess to avoid blocking UI.
- [ ] **State management** — Set up `zustand@5.0.11` stores: conversation state, editor state (current TSX, dirty flag), project state (save/load), settings state (API keys, model, preferences).
- [ ] **Theme & brand system** — Generalize `src/theme/` into pluggable brand kit. Default neutral theme. User provides brand info via chat or settings -> AI incorporates. Themes follow frontend-design skill.
- [ ] **File export & auto-open** — Export `.pptx` to chosen path via Electron dialog. Auto-open with `shell.openPath()`. Optional PDF export via headless LibreOffice.
- [ ] **Settings & configuration** — API key management (OpenRouter, Anthropic, OpenAI). Model selection dropdown. Export directory. Theme/brand prefs. Persist via `electron-store` or JSON file. Styled per design system.
- [ ] **Project/session management** — Save/load projects: conversation history (`CoreMessage[]`), TSX source, generated files. Recent projects list. Auto-save on changes. Store in user data directory.

## Files

### New

- `app/package.json` — Electron + AI SDK + UI dependencies (all pinned versions above)
- `app/electron.vite.config.ts` — electron-vite configuration
- `app/src/main/index.ts` — Electron main process, window management
- `app/src/main/ai-service.ts` — Vercel AI SDK pipeline, provider registry, tool execution
- `app/src/main/compiler.ts` — TSX -> PPTX compilation worker (esbuild + react-pptx-extended)
- `app/src/main/ipc.ts` — IPC handlers bridging AI service to renderer
- `app/src/preload/index.ts` — Preload script using @electron-toolkit/preload
- `app/src/renderer/index.html` — Renderer entry HTML
- `app/src/renderer/src/App.tsx` — Root app component
- `app/src/renderer/src/design-system/` — Tailwind 4 config, CSS variables, tokens
- `app/src/renderer/src/components/chat/` — Chat panel with useChat() integration
- `app/src/renderer/src/components/editor/` — Monaco editor panel
- `app/src/renderer/src/components/preview/` — Slide preview panel
- `app/src/renderer/src/components/layout/` — Panel layout, resizer, status bar
- `app/src/renderer/src/components/settings/` — Settings UI
- `app/src/renderer/src/stores/` — Zustand stores (conversation, editor, project, settings)
- `app/src/shared/prompts/system.ts` — System prompt with embedded frontend-design skill
- `app/src/shared/tools/` — Zod-typed tool definitions and handlers
- `app/src/shared/types/` — Shared TypeScript types

### Reused/Modified

- `packages/react-pptx-extended/` — Consumed by compilation engine (no changes)
- `src/theme/` — Extracted into pluggable brand system
- `skills/frontend-design/SKILL.md` — Content embedded in AI system prompt
- `AGENTS.md` — Design criteria embedded in AI system prompt
- `package.json` — Updated workspaces to include `app/`, new scripts
- `tsconfig.json` — Updated for Electron builds

## Acceptance Criteria

- Encore launches as an Electron 40 desktop app with a visually distinctive UI following the frontend-design skill
- Vercel AI SDK v6 powers the chat with streaming responses and tool-calling via OpenRouter
- Three-panel layout (chat, code editor, slide preview) with code panel toggle
- User describes a presentation -> AI plans a design direction, writes TSX, compiles, and previews — autonomously via `maxSteps`
- Generated presentations follow the frontend-design skill (distinctive fonts, atmospheric backgrounds, unexpected composition, depth, memorability)
- User iterates via chat -> AI edits TSX granularly and recompiles
- User can manually edit TSX in Monaco editor -> preview updates
- AI uses tools to read local files, search the web, and fetch images when relevant
- Provider is configurable (OpenRouter default, Anthropic/OpenAI optional) via settings
- Export to `.pptx` auto-opens in system default app
- Projects save/load with full conversation + code + output state
- All dependencies use the specified latest compatible versions

## Definition of Done

When a user can launch Encore, describe a presentation in natural language, watch the AI (powered by Vercel AI SDK v6 via OpenRouter) autonomously plan a design direction, write distinctive React-PPTX code in the Monaco editor (guided by the frontend-design skill), compile and show live slide previews, iterate through chat or direct code edits, and export a polished `.pptx` — all within a beautifully-designed Electron 40 desktop app that itself embodies the frontend-design skill's standards. All packages are at their specified latest compatible versions.