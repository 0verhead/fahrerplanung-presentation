import { useState, useCallback } from 'react'
import { ChatPanel } from './components/chat'
import { CodeEditorPanel } from './components/editor'
import { PanelLayout, StatusBar } from './components/layout'
import { SlidePreviewPanel } from './components/preview'
import { SettingsPanel } from './components/settings'

function App(): React.JSX.Element {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), [])
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), [])

  return (
    <div className="bg-atmosphere relative flex h-full flex-col overflow-hidden">
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

      {/* Main content area — Three-panel resizable layout */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <PanelLayout
          chatPanel={<ChatPanel />}
          editorPanel={<CodeEditorPanel />}
          previewPanel={<SlidePreviewPanel />}
        />
      </div>

      {/* Status bar */}
      <div className="relative z-10">
        <StatusBar onOpenSettings={handleOpenSettings} />
      </div>

      {/* Settings modal */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={handleCloseSettings} />
    </div>
  )
}

export default App
