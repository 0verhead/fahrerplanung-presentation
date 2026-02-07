/**
 * ChatPanel — Main chat interface component
 *
 * Provides the conversation UI with:
 * - Message list with markdown rendering
 * - Streaming response display
 * - Tool call status indicators
 * - Input box with send/abort controls
 *
 * Uses Zustand for state management via useConversationStore.
 */

import { useCallback, useEffect, useRef } from 'react'
import { useConversationStore } from '../../stores'
import { ChatInput } from './ChatInput'
import { ChatMessageList } from './ChatMessageList'
import { StreamingIndicator } from './StreamingIndicator'

export function ChatPanel(): React.JSX.Element {
  // Get state and actions from store
  const messages = useConversationStore((s) => s.messages)
  const isLoading = useConversationStore((s) => s.isLoading)
  const isStreaming = useConversationStore((s) => s.isStreaming)
  const streamingText = useConversationStore((s) => s.streamingText)
  const activeToolCalls = useConversationStore((s) => s.activeToolCalls)
  const stepProgress = useConversationStore((s) => s.stepProgress)
  const error = useConversationStore((s) => s.error)

  const loadHistory = useConversationStore((s) => s.loadHistory)
  const handleStreamEvent = useConversationStore((s) => s.handleStreamEvent)
  const sendMessage = useConversationStore((s) => s.sendMessage)
  const abort = useConversationStore((s) => s.abort)
  const clearHistory = useConversationStore((s) => s.clearHistory)
  const clearError = useConversationStore((s) => s.clearError)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change or streaming updates
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingText, scrollToBottom])

  // Load conversation history on mount
  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // Subscribe to stream events
  useEffect(() => {
    const unsubscribe = window.api.onStreamEvent(handleStreamEvent)
    return () => {
      unsubscribe()
    }
  }, [handleStreamEvent])

  // Send message handler
  const handleSendMessage = useCallback(
    (content: string) => {
      sendMessage(content)
    },
    [sendMessage]
  )

  // Abort handler
  const handleAbort = useCallback(() => {
    abort()
  }, [abort])

  // Clear history handler
  const handleClearHistory = useCallback(async () => {
    await clearHistory()
  }, [clearHistory])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-full flex-col bg-surface-base">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-body-medium text-text-primary">Chat</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-default border-t-transparent" />
            <span className="text-caption text-text-tertiary">Loading conversation...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-surface-base">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-body-medium text-text-primary">Chat</span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-caption transition-fast hover:text-text-secondary"
            title="Clear conversation"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !isStreaming ? (
          <EmptyState onSuggestionClick={handleSendMessage} />
        ) : (
          <>
            <ChatMessageList messages={messages} />

            {/* Streaming response */}
            {isStreaming && (
              <div className="mt-4">
                <StreamingIndicator
                  text={streamingText}
                  toolCalls={activeToolCalls}
                  stepProgress={stepProgress}
                />
              </div>
            )}

            {/* Error display */}
            {error && <ErrorDisplay error={error} onDismiss={clearError} />}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-border p-4">
        <ChatInput
          onSend={handleSendMessage}
          onAbort={handleAbort}
          isStreaming={isStreaming}
          disabled={isStreaming}
        />
      </div>
    </div>
  )
}

/** Empty state when no messages */
function EmptyState({
  onSuggestionClick
}: {
  onSuggestionClick: (suggestion: string) => void
}): React.JSX.Element {
  const suggestions = [
    'Create a startup pitch deck',
    'Design a quarterly report',
    'Make a product launch presentation'
  ]

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-raised shadow-md">
        <span className="text-2xl">&#10024;</span>
      </div>
      <div>
        <h3 className="text-heading text-text-primary">Start a conversation</h3>
        <p className="mt-1 max-w-sm text-body text-text-tertiary">
          Describe the presentation you want to create. I&apos;ll design it with distinctive
          typography, atmospheric visuals, and professional layouts.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-caption transition-fast hover:border-border-strong hover:bg-surface-overlay"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Error display component */
function ErrorDisplay({
  error,
  onDismiss
}: {
  error: string
  onDismiss: () => void
}): React.JSX.Element {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-lg border border-error/30 bg-error-dim/50 p-3">
      <span className="mt-0.5 text-error">&#9888;</span>
      <div className="flex-1">
        <p className="text-body text-error">{error}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-caption text-error/70 transition-fast hover:text-error"
      >
        Dismiss
      </button>
    </div>
  )
}
