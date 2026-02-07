/**
 * CodeEditorPanel — Monaco-based TSX code editor
 *
 * Features:
 * - TSX syntax highlighting with custom dark theme
 * - Syncs with AI-generated code via IPC
 * - User-editable with debounced updates to main process
 * - Diff view for reviewing AI changes with accept/reject
 * - Designed per Encore's design system (Refined Dark Studio)
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import Editor, { DiffEditor, loader, type Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import type { TsxChangedEvent } from '../../../../shared/types/ai'

// Configure Monaco to load from node_modules (bundled with Vite)
loader.config({ paths: { vs: 'node_modules/monaco-editor/min/vs' } })

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CodeEditorPanelProps {
  className?: string
}

interface PendingChange {
  newCode: string
  previousCode: string
}

// ---------------------------------------------------------------------------
// Custom Monaco theme matching Encore design system
// ---------------------------------------------------------------------------

function defineEncoreTheme(monaco: Monaco): void {
  monaco.editor.defineTheme('encore-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // JSX/TSX specific
      { token: 'tag', foreground: '60a5fa' }, // JSX tags - info blue
      { token: 'tag.attribute.name', foreground: 'fbbf4e' }, // Attributes - accent bright
      { token: 'attribute.value', foreground: '34d399' }, // Attribute values - success
      { token: 'delimiter.bracket', foreground: 'a0a0a8' }, // Brackets - secondary

      // General syntax
      { token: 'keyword', foreground: 'f472b6' }, // Keywords - pink
      { token: 'keyword.control', foreground: 'f472b6' },
      { token: 'string', foreground: '34d399' }, // Strings - success green
      { token: 'string.key', foreground: 'fbbf4e' }, // Object keys - accent
      { token: 'number', foreground: 'f5a623' }, // Numbers - accent
      { token: 'comment', foreground: '636370', fontStyle: 'italic' }, // Comments - tertiary
      { token: 'type', foreground: '60a5fa' }, // Types - info blue
      { token: 'type.identifier', foreground: '60a5fa' },
      { token: 'variable', foreground: 'ededef' }, // Variables - primary
      { token: 'variable.parameter', foreground: 'fcd778' }, // Parameters - vivid accent
      { token: 'function', foreground: 'c084fc' }, // Functions - purple
      { token: 'operator', foreground: 'a0a0a8' }, // Operators - secondary
      { token: 'constant', foreground: 'f5a623' }, // Constants - accent
      { token: 'punctuation', foreground: '636370' } // Punctuation - tertiary
    ],
    colors: {
      // Editor background
      'editor.background': '#0c0c0f', // surface-base
      'editor.foreground': '#ededef', // text-primary
      'editorCursor.foreground': '#f5a623', // accent
      'editor.lineHighlightBackground': '#111114', // surface-raised
      'editor.selectionBackground': '#3d2a0744', // accent-dim + alpha
      'editor.selectionHighlightBackground': '#3d2a0733',
      'editor.inactiveSelectionBackground': '#3d2a0722',

      // Line numbers
      'editorLineNumber.foreground': '#43434d', // text-disabled
      'editorLineNumber.activeForeground': '#a0a0a8', // text-secondary

      // Gutter
      'editorGutter.background': '#0c0c0f',
      'editorGutter.modifiedBackground': '#fbbf24', // warning
      'editorGutter.addedBackground': '#34d399', // success
      'editorGutter.deletedBackground': '#f87171', // error

      // Indent guides
      'editorIndentGuide.background': '#232328', // surface-highest
      'editorIndentGuide.activeBackground': '#3d2a07', // accent-dim

      // Bracket matching
      'editorBracketMatch.background': '#3d2a0744',
      'editorBracketMatch.border': '#f5a623',

      // Find/replace
      'editor.findMatchBackground': '#6b4a0f66', // accent-muted + alpha
      'editor.findMatchHighlightBackground': '#3d2a0744',

      // Minimap
      'minimap.background': '#08080a', // surface-ground
      'minimapSlider.background': '#23232833',
      'minimapSlider.hoverBackground': '#23232855',
      'minimapSlider.activeBackground': '#23232877',

      // Scrollbar
      'scrollbar.shadow': '#00000040',
      'scrollbarSlider.background': '#23232866',
      'scrollbarSlider.hoverBackground': '#23232888',
      'scrollbarSlider.activeBackground': '#232328aa',

      // Widget colors (autocomplete, hover, etc.)
      'editorWidget.background': '#111114',
      'editorWidget.border': 'rgba(255, 255, 255, 0.1)',
      'editorSuggestWidget.background': '#111114',
      'editorSuggestWidget.border': 'rgba(255, 255, 255, 0.1)',
      'editorSuggestWidget.selectedBackground': '#1c1c20',
      'editorSuggestWidget.highlightForeground': '#f5a623',

      // Hover widget
      'editorHoverWidget.background': '#111114',
      'editorHoverWidget.border': 'rgba(255, 255, 255, 0.1)'
    }
  })
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CodeEditorPanel({ className = '' }: CodeEditorPanelProps): React.JSX.Element {
  const [code, setCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isExternalUpdateRef = useRef(false)

  // ---------------------------------------------------------------------------
  // Load initial code and subscribe to changes
  // ---------------------------------------------------------------------------

  useEffect(() => {
    // Load initial TSX from main process
    window.api.getTsx().then(({ code: initialCode }) => {
      setCode(initialCode)
      setIsLoading(false)
    })

    // Subscribe to TSX changes from AI
    const unsubscribe = window.api.onTsxChanged((event: TsxChangedEvent) => {
      if (event.source === 'ai' && event.previousCode !== undefined) {
        // Show diff view for AI changes
        setPendingChange({
          newCode: event.code,
          previousCode: event.previousCode
        })
      } else {
        // Direct update (initial load or non-diff update)
        isExternalUpdateRef.current = true
        setCode(event.code)
      }
    })

    return () => {
      unsubscribe()
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Debounced update to main process
  // ---------------------------------------------------------------------------

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value === undefined || isExternalUpdateRef.current) {
      isExternalUpdateRef.current = false
      return
    }

    setCode(value)
    setIsDirty(true)

    // Debounce updates to main process (500ms)
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    updateTimeoutRef.current = setTimeout(() => {
      window.api.setTsx(value).then(() => {
        setIsDirty(false)
      })
    }, 500)
  }, [])

  // ---------------------------------------------------------------------------
  // Editor mount handlers
  // ---------------------------------------------------------------------------

  const handleEditorDidMount = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editorInstance
      monacoRef.current = monaco

      // Define and apply custom theme
      defineEncoreTheme(monaco)
      monaco.editor.setTheme('encore-dark')

      // Configure TypeScript/TSX defaults for better IntelliSense
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.React,
        jsxFactory: 'React.createElement',
        reactNamespace: 'React',
        allowSyntheticDefaultImports: true,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.ESNext
      })

      // Focus the editor
      editorInstance.focus()
    },
    []
  )

  const handleDiffEditorDidMount = useCallback(
    (diffEditorInstance: editor.IStandaloneDiffEditor, monaco: Monaco) => {
      diffEditorRef.current = diffEditorInstance
      monacoRef.current = monaco

      // Define and apply custom theme
      defineEncoreTheme(monaco)
      monaco.editor.setTheme('encore-dark')
    },
    []
  )

  // ---------------------------------------------------------------------------
  // Diff view actions
  // ---------------------------------------------------------------------------

  const handleAcceptChanges = useCallback(() => {
    if (pendingChange) {
      isExternalUpdateRef.current = true
      setCode(pendingChange.newCode)
      setPendingChange(null)
      setIsDirty(false)
    }
  }, [pendingChange])

  const handleRejectChanges = useCallback(() => {
    setPendingChange(null)
  }, [])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Show diff view when there are pending AI changes
  if (pendingChange) {
    return (
      <div className={`flex h-full flex-col ${className}`}>
        {/* Diff header with actions */}
        <div className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-label tracking-widest text-text-tertiary">AI CHANGES</span>
            <span className="text-caption text-text-secondary">
              Review the proposed changes below
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRejectChanges}
              className="rounded-md bg-surface-overlay px-3 py-1.5 text-sm text-text-secondary transition-fast hover:bg-surface-elevated hover:text-text-primary"
            >
              Reject
            </button>
            <button
              onClick={handleAcceptChanges}
              className="rounded-md bg-accent-default px-3 py-1.5 text-sm font-medium text-text-inverse transition-fast hover:bg-accent-bright"
            >
              Accept Changes
            </button>
          </div>
        </div>

        {/* Diff editor */}
        <div className="flex-1">
          <DiffEditor
            original={pendingChange.previousCode}
            modified={pendingChange.newCode}
            language="typescript"
            theme="encore-dark"
            onMount={handleDiffEditorDidMount}
            options={{
              readOnly: true,
              renderSideBySide: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              fontFamily: "'Geist Mono', ui-monospace, 'SF Mono', 'Cascadia Code', monospace",
              fontLigatures: true,
              lineHeight: 20,
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              wordWrap: 'on'
            }}
          />
        </div>
      </div>
    )
  }

  // Normal editor view
  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Editor header */}
      <div className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-label tracking-widest text-text-tertiary">PRESENTATION.TSX</span>
          {isDirty && (
            <span className="animate-pulse-glow rounded bg-accent-dim px-1.5 py-0.5 text-2xs text-accent-bright">
              Saving...
            </span>
          )}
        </div>
        {code && (
          <span className="text-caption text-text-tertiary">{code.split('\n').length} lines</span>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-default border-t-transparent" />
            <span className="text-caption text-text-tertiary">Loading editor...</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !code && (
        <div className="flex flex-1 flex-col items-center justify-center p-8">
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
                  d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                />
              </svg>
            </div>
            <h3 className="text-title text-text-primary">No presentation code yet</h3>
            <p className="max-w-sm text-body text-text-tertiary">
              Start a conversation in the chat panel to generate your first presentation. The AI
              will write the code here.
            </p>
          </div>
        </div>
      )}

      {/* Monaco editor */}
      {!isLoading && code && (
        <div className="flex-1">
          <Editor
            value={code}
            language="typescript"
            theme="encore-dark"
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: true, scale: 1, showSlider: 'mouseover' },
              scrollBeyondLastLine: false,
              fontSize: 13,
              fontFamily: "'Geist Mono', ui-monospace, 'SF Mono', 'Cascadia Code', monospace",
              fontLigatures: true,
              lineHeight: 20,
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              tabSize: 2,
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
              autoIndent: 'full',
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true
              },
              suggest: {
                showKeywords: true,
                showSnippets: true
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
