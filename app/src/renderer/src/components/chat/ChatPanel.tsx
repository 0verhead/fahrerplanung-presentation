/**
 * ChatPanel — Main chat interface component
 *
 * Provides the conversation UI with:
 * - Message list with markdown rendering
 * - Streaming response display
 * - Tool call status indicators
 * - Input box with send/abort controls
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AIStreamEvent, ChatMessage } from '../../../../shared/types/ai'
import { ChatInput } from './ChatInput'
import { ChatMessageList } from './ChatMessageList'
import { StreamingIndicator } from './StreamingIndicator'

/** Active tool call being displayed */
interface ActiveToolCall {
  id: string
  name: string
  status: 'running' | 'complete'
}

/** Step progress information */
interface StepProgress {
  current: number
  max: number
}

export function ChatPanel(): React.JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [activeToolCalls, setActiveToolCalls] = useState<ActiveToolCall[]>([])
  const [stepProgress, setStepProgress] = useState<StepProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const streamingTextRef = useRef('')

  // Scroll to bottom when messages change or streaming updates
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingText, scrollToBottom])

  // Load conversation history on mount
  useEffect(() => {
    window.api.getHistory().then(({ messages: history }) => {
      setMessages(history)
    })
  }, [])

  // Subscribe to stream events
  useEffect(() => {
    const unsubscribe = window.api.onStreamEvent((event: AIStreamEvent) => {
      switch (event.type) {
        case 'text-delta':
          streamingTextRef.current += event.textDelta
          setStreamingText(streamingTextRef.current)
          break

        case 'tool-call-start':
          setActiveToolCalls((prev) => [
            ...prev,
            { id: event.toolCallId, name: event.toolName, status: 'running' }
          ])
          break

        case 'tool-call-result':
          setActiveToolCalls((prev) =>
            prev.map((tc) =>
              tc.id === event.toolCallId ? { ...tc, status: 'complete' as const } : tc
            )
          )
          // Remove completed tool call after a short delay
          setTimeout(() => {
            setActiveToolCalls((prev) => prev.filter((tc) => tc.id !== event.toolCallId))
          }, 1000)
          break

        case 'step-start':
          setStepProgress({ current: event.stepNumber, max: event.maxSteps })
          break

        case 'step-finish':
          // Update step progress
          setStepProgress((prev) =>
            prev ? { ...prev, current: event.stepNumber } : { current: event.stepNumber, max: 10 }
          )
          break

        case 'finish':
          // Add assistant message to history
          if (event.text.trim()) {
            const assistantMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: event.text,
              createdAt: new Date().toISOString()
            }
            setMessages((prev) => [...prev, assistantMessage])
          }
          // Reset streaming state
          setIsStreaming(false)
          setStreamingText('')
          streamingTextRef.current = ''
          setActiveToolCalls([])
          setStepProgress(null)
          break

        case 'error':
          setError(event.error)
          setIsStreaming(false)
          setStreamingText('')
          streamingTextRef.current = ''
          setActiveToolCalls([])
          setStepProgress(null)
          break
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Send message handler
  const handleSendMessage = useCallback((content: string) => {
    // Clear any previous error
    setError(null)

    // Add user message optimistically
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    }
    setMessages((prev) => [...prev, userMessage])

    // Start streaming state
    setIsStreaming(true)
    streamingTextRef.current = ''
    setStreamingText('')

    // Send to main process
    window.api.sendMessage(content)
  }, [])

  // Abort handler
  const handleAbort = useCallback(() => {
    window.api.abort()
    setIsStreaming(false)
    setStreamingText('')
    streamingTextRef.current = ''
    setActiveToolCalls([])
    setStepProgress(null)
  }, [])

  // Clear history handler
  const handleClearHistory = useCallback(async () => {
    await window.api.clearHistory()
    setMessages([])
    setError(null)
  }, [])

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
          <EmptyState />
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
            {error && <ErrorDisplay error={error} onDismiss={() => setError(null)} />}

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
function EmptyState(): React.JSX.Element {
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
        {[
          'Create a startup pitch deck',
          'Design a quarterly report',
          'Make a product launch presentation'
        ].map((suggestion) => (
          <button
            key={suggestion}
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
