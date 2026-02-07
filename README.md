# Encore

AI-powered PowerPoint presentation generator. A Cursor-like desktop app that lets you create professional presentations through natural language conversation.

## Quick Start

```bash
# Install dependencies
npm install

# Run the app in development mode
cd app && npm run dev
```

## Requirements

- **Node.js** 22+ (required by Vite 7)
- **npm** 10+
- **API Key** from one of:
  - [OpenRouter](https://openrouter.ai) (recommended - access to Claude, GPT-4, etc.)
  - [Anthropic](https://console.anthropic.com)
  - [OpenAI](https://platform.openai.com)

## Project Structure

```
.
├── app/                          # Encore Electron app
│   ├── src/
│   │   ├── main/                 # Main process (AI, compilation, IPC)
│   │   ├── preload/              # Preload scripts (API bridge)
│   │   ├── renderer/             # React UI (chat, editor, preview)
│   │   └── shared/               # Shared types, prompts, tools
│   └── package.json
├── packages/
│   └── react-pptx-extended/      # PPTX generation library
└── package.json                  # Monorepo root
```

## Development

### Running the App

```bash
cd app

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

### Code Quality

```bash
cd app

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check
```

## How It Works

1. **Chat** - Describe your presentation in natural language
2. **AI Writes Code** - The AI generates React-PPTX TSX code
3. **Live Preview** - See compiled slides update in real-time
4. **Export** - Save as `.pptx` and open in PowerPoint

### Three-Panel Layout

| Chat Panel | Code Editor | Slide Preview |
|------------|-------------|---------------|
| Conversation with AI | Monaco editor with TSX | Live slide thumbnails |
| Tool status indicators | Diff view for AI changes | Zoom and navigation |
| Streaming responses | Accept/reject workflow | Export controls |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + B` | Toggle code panel |
| `Cmd/Ctrl + Enter` | Send message |
| `Escape` | Close settings |

## Configuration

On first launch, open **Settings** (gear icon in status bar):

1. **API Keys** - Add your OpenRouter, Anthropic, or OpenAI key
2. **Model** - Select your preferred model
3. **Brand Kit** - Choose from Neutral, Executive, Editorial, or Dashboard themes

Settings are persisted automatically.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Electron 40, Vite 7, React 19 |
| AI | Vercel AI SDK v6, Zod |
| Editor | Monaco Editor 0.55 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| PPTX | react-pptx-extended + pptxgenjs |

## Troubleshooting

### "No API key configured"
Open Settings and add your API key for at least one provider.

### Slides not compiling
Check the chat panel for error messages. The AI will attempt to self-correct compilation errors.

### Fonts look different in PowerPoint
The generated PPTX uses font names from the code. Install the fonts or use system fonts like Helvetica Neue, Georgia, or Garamond.

---

Built with the `frontend-design` skill - distinctive typography, atmospheric backgrounds, and memorable visual composition.
