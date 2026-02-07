import { useCallback, useEffect, useRef, useState } from 'react'
import { ResizeHandle } from './ResizeHandle'

interface PanelLayoutProps {
  chatPanel: React.ReactNode
  editorPanel: React.ReactNode
  previewPanel: React.ReactNode
}

// Panel size constraints (in pixels)
const MIN_CHAT_WIDTH = 280
const MAX_CHAT_WIDTH = 500
const MIN_EDITOR_WIDTH = 300
const MIN_PREVIEW_WIDTH = 280
const DEFAULT_CHAT_WIDTH = 320
const DEFAULT_PREVIEW_WIDTH = 384

/**
 * PanelLayout — Three-panel resizable layout with Cursor-like code panel toggle.
 *
 * Features:
 * - Resizable chat panel (left)
 * - Collapsible code editor panel (center) with Cmd/Ctrl+B toggle
 * - Resizable preview panel (right)
 * - Smooth transitions on collapse/expand
 * - Keyboard accessible resize handles
 */
export function PanelLayout({
  chatPanel,
  editorPanel,
  previewPanel
}: PanelLayoutProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)

  // Panel widths (stored in state for reactivity)
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH)
  const [previewWidth, setPreviewWidth] = useState(DEFAULT_PREVIEW_WIDTH)
  const [containerWidth, setContainerWidth] = useState(0)

  // Code panel collapse state
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false)
  const [editorWidthBeforeCollapse, setEditorWidthBeforeCollapse] = useState<number | null>(null)

  // Track container width via ResizeObserver
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    resizeObserver.observe(container)
    // Set initial width
    setContainerWidth(container.clientWidth)

    return () => resizeObserver.disconnect()
  }, [])

  // Calculate editor width based on container and other panels
  const calculateEditorWidth = useCallback((): number => {
    if (containerWidth === 0) return MIN_EDITOR_WIDTH
    // Account for resize handles (1px each) and collapsed indicator (40px)
    const availableWidth = isEditorCollapsed
      ? containerWidth - chatWidth - previewWidth - 40 - 1
      : containerWidth - chatWidth - previewWidth - 2
    return Math.max(MIN_EDITOR_WIDTH, availableWidth)
  }, [containerWidth, chatWidth, previewWidth, isEditorCollapsed])

  // Handle chat panel resize
  const handleChatResize = useCallback((delta: number): void => {
    setChatWidth((prev) => {
      const newWidth = prev + delta
      return Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, newWidth))
    })
  }, [])

  // Handle preview panel resize (drag from left edge, so delta is inverted)
  const handlePreviewResize = useCallback(
    (delta: number): void => {
      const maxPreviewWidth = containerWidth - chatWidth - MIN_EDITOR_WIDTH - 2

      setPreviewWidth((prev) => {
        const newWidth = prev - delta // Inverted because we're dragging from left
        return Math.min(maxPreviewWidth, Math.max(MIN_PREVIEW_WIDTH, newWidth))
      })
    },
    [containerWidth, chatWidth]
  )

  // Toggle code editor panel (Cursor-like behavior)
  const toggleEditor = useCallback((): void => {
    if (isEditorCollapsed) {
      // Expand: restore previous width
      setIsEditorCollapsed(false)
      if (editorWidthBeforeCollapse) {
        // Adjust preview width to make room
        const currentEditorWidth = calculateEditorWidth()
        const widthDelta = editorWidthBeforeCollapse - currentEditorWidth
        if (widthDelta > 0) {
          setPreviewWidth((prev) => Math.max(MIN_PREVIEW_WIDTH, prev - widthDelta / 2))
          setChatWidth((prev) => Math.max(MIN_CHAT_WIDTH, prev - widthDelta / 2))
        }
      }
      setEditorWidthBeforeCollapse(null)
    } else {
      // Collapse: save current width
      setEditorWidthBeforeCollapse(calculateEditorWidth())
      setIsEditorCollapsed(true)
    }
  }, [isEditorCollapsed, editorWidthBeforeCollapse, calculateEditorWidth])

  // Keyboard shortcut: Cmd/Ctrl + B to toggle editor panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Check for Cmd+B (Mac) or Ctrl+B (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        toggleEditor()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleEditor])

  const editorWidth = isEditorCollapsed ? 0 : calculateEditorWidth()

  return (
    <div ref={containerRef} className="flex h-full w-full overflow-hidden">
      {/* Chat Panel */}
      <div
        className="flex h-full flex-shrink-0 flex-col overflow-hidden border-r border-border transition-[width] duration-200 ease-out"
        style={{ width: chatWidth }}
      >
        {chatPanel}
      </div>

      {/* Chat/Editor resize handle */}
      {!isEditorCollapsed && (
        <ResizeHandle onResize={handleChatResize} orientation="vertical" className="z-10" />
      )}

      {/* Code Editor Panel — collapsible */}
      <div
        className={`
          relative flex h-full flex-col overflow-hidden border-r border-border
          transition-all duration-300 ease-out
          ${isEditorCollapsed ? 'w-0 opacity-0' : 'flex-1 opacity-100'}
        `}
        style={{
          minWidth: isEditorCollapsed ? 0 : MIN_EDITOR_WIDTH,
          width: isEditorCollapsed ? 0 : editorWidth
        }}
      >
        {/* Collapse button overlay — positioned in top-right corner */}
        <button
          onClick={toggleEditor}
          className="absolute right-2 top-2 z-20 flex h-6 w-6 items-center justify-center rounded bg-surface-overlay/80 text-text-tertiary opacity-0 transition-all hover:bg-surface-elevated hover:text-text-secondary group-hover:opacity-100"
          style={{ opacity: 1 }} // Always visible for now, could be hover-revealed later
          title="Collapse code panel (⌘B)"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Editor content (full height, editor has its own header) */}
        <div className="flex-1 overflow-hidden">{editorPanel}</div>
      </div>

      {/* Collapsed editor indicator — shows toggle button when collapsed */}
      {isEditorCollapsed && (
        <div className="flex h-full w-10 flex-shrink-0 flex-col items-center border-r border-border bg-surface-raised pt-2">
          <button
            onClick={toggleEditor}
            className="flex h-8 w-8 items-center justify-center rounded text-text-tertiary transition-all hover:bg-surface-overlay hover:text-accent"
            title="Show code panel (⌘B)"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>
          </button>
          <span className="mt-2 origin-center rotate-90 whitespace-nowrap text-[10px] font-medium uppercase tracking-widest text-text-disabled">
            Code
          </span>
        </div>
      )}

      {/* Editor/Preview resize handle */}
      {!isEditorCollapsed && (
        <ResizeHandle onResize={handlePreviewResize} orientation="vertical" className="z-10" />
      )}

      {/* Preview Panel */}
      <div
        className="flex h-full flex-shrink-0 flex-col overflow-hidden transition-[width] duration-200 ease-out"
        style={{ width: previewWidth }}
      >
        {previewPanel}
      </div>
    </div>
  )
}
