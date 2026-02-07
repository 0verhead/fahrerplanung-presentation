/**
 * ChatInput — Message input box with send/abort controls
 */

import { useCallback, useRef, useState } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  onAbort: () => void
  isStreaming: boolean
  disabled?: boolean
}

export function ChatInput({
  onSend,
  onAbort,
  isStreaming,
  disabled = false
}: ChatInputProps): React.JSX.Element {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setValue('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }, [value, disabled, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Enter (without Shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }, [])

  return (
    <div className="relative flex items-end gap-2">
      {/* Textarea */}
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? 'Generating...' : 'Describe your presentation...'}
          disabled={disabled}
          rows={1}
          className="text-body w-full resize-none rounded-xl border border-border bg-surface-raised px-4 py-3 pr-12 text-text-primary placeholder:text-text-disabled focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ maxHeight: '200px' }}
        />

        {/* Send button (inside textarea container) */}
        {!isStreaming && (
          <button
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-text-inverse transition-fast hover:bg-accent-bright disabled:cursor-not-allowed disabled:opacity-30"
            title="Send message (Enter)"
          >
            <SendIcon />
          </button>
        )}
      </div>

      {/* Abort button (shown when streaming) */}
      {isStreaming && (
        <button
          onClick={onAbort}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-error/30 bg-error-dim text-error transition-fast hover:border-error/50 hover:bg-error-dim/80"
          title="Stop generating"
        >
          <StopIcon />
        </button>
      )}
    </div>
  )
}

/** Send icon SVG */
function SendIcon(): React.JSX.Element {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

/** Stop icon SVG */
function StopIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
}
