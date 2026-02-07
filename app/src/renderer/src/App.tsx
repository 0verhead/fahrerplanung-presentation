import { ChatPanel } from './components/chat'
import { CodeEditorPanel } from './components/editor'

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

        {/* Slide preview panel — placeholder for now */}
        <div className="flex h-full w-96 min-w-72 flex-col bg-surface-ground">
          <div className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-2">
            <span className="text-label tracking-widest text-text-tertiary">PREVIEW</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-raised">
                <svg
                  className="h-7 w-7 text-text-tertiary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                  />
                </svg>
              </div>
              <h3 className="text-title text-text-primary">Slide Preview</h3>
              <p className="max-w-48 text-sm text-text-tertiary">
                Coming in the next task. Compiled slides will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
