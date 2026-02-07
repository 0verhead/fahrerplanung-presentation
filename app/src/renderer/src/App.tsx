import { useState, useCallback, useEffect } from 'react'
import { ChatPanel } from './components/chat'
import { CodeEditorPanel } from './components/editor'
import { PanelLayout, StatusBar } from './components/layout'
import { SlidePreviewPanel } from './components/preview'
import { SettingsPanel } from './components/settings'
import { ProjectMenu } from './components/project'
import { useProjectStore, startAutoSave, stopAutoSave } from './stores'

function App(): React.JSX.Element {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), [])
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), [])

  // Initialize project store and auto-save on mount
  const initialize = useProjectStore((s) => s.initialize)

  useEffect(() => {
    initialize()
    startAutoSave()
    return () => stopAutoSave()
  }, [initialize])

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

      {/* Title bar with project menu */}
      <div className="relative z-10 flex h-10 flex-shrink-0 items-center border-b border-border bg-surface-base px-3">
        <ProjectMenu />
      </div>

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
