import { ChatPanel } from './components/chat'

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

      {/* Main content area — Chat panel takes full width for now */}
      {/* TODO: Add resizable three-panel layout (chat, editor, preview) */}
      <div className="relative z-10 flex h-full w-full">
        {/* Chat panel */}
        <div className="flex h-full w-full max-w-lg flex-col border-r border-border">
          <ChatPanel />
        </div>

        {/* Placeholder for editor + preview panels */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-label tracking-widest">Coming Soon</span>
            <h2 className="text-display-2 text-text-primary">Code Editor & Preview</h2>
            <p className="max-w-md text-body text-text-tertiary">
              The Monaco code editor and live slide preview panels will be added in upcoming tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
