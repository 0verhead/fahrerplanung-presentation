import { ChatPanel } from './components/chat'
import { CodeEditorPanel } from './components/editor'
import { SlidePreviewPanel } from './components/preview'

function App(): React.JSX.Element {
  return (
    <div className="bg-atmosphere relative flex h-full overflow-hidden">
      {/* Subtle noise texture */}
      <div className="bg-noise pointer-events-none absolute inset-0 z-0" />

      {/* Decorative geometric accent — diagonal amber strip */}
      <div
        className="pointer-events-none absolute -right-20 top-1/4 z-0 h-[200px] w-[600px] rotate-[-15deg] opacity-[0.04]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--accent-default) 40%, var(--accent-bright) 60%, transparent 100%)'
        }}
      />

      {/* Main content area — Three-panel layout (chat, editor, preview) */}
      {/* TODO: Add resizable panels in "Panel layout & micro-interactions" task */}
      <div className="relative z-10 flex h-full w-full">
        {/* Chat panel — fixed width */}
        <div className="flex h-full w-80 min-w-72 max-w-md flex-col border-r border-border">
          <ChatPanel />
        </div>

        {/* Code editor panel — flexible width */}
        <div className="flex h-full min-w-[400px] flex-1 flex-col border-r border-border">
          <CodeEditorPanel />
        </div>

        {/* Slide preview panel */}
        <div className="flex h-full w-96 min-w-72 flex-col">
          <SlidePreviewPanel />
        </div>
      </div>
    </div>
  )
}

export default App
