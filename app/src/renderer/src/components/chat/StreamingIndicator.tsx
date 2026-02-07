/**
 * StreamingIndicator — Shows streaming response and tool call status
 */

import Markdown from 'react-markdown'

interface ActiveToolCall {
  id: string
  name: string
  status: 'running' | 'complete'
}

interface StepProgress {
  current: number
  max: number
}

interface StreamingIndicatorProps {
  text: string
  toolCalls: ActiveToolCall[]
  stepProgress: StepProgress | null
}

export function StreamingIndicator({
  text,
  toolCalls,
  stepProgress
}: StreamingIndicatorProps): React.JSX.Element {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-text-secondary">
        <span className="animate-pulse text-sm">&#10024;</span>
      </div>

      {/* Content */}
      <div className="max-w-[85%] rounded-xl bg-surface-raised px-4 py-3">
        {/* Step progress */}
        {stepProgress && (
          <div className="mb-2 flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-surface-overlay">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${(stepProgress.current / stepProgress.max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-disabled">
              Step {stepProgress.current}/{stepProgress.max}
            </span>
          </div>
        )}

        {/* Active tool calls */}
        {toolCalls.length > 0 && (
          <div className="mb-3 flex flex-col gap-1.5">
            {toolCalls.map((toolCall) => (
              <ToolCallStatus key={toolCall.id} toolCall={toolCall} />
            ))}
          </div>
        )}

        {/* Streaming text */}
        {text ? (
          <div className="prose-encore">
            <Markdown
              components={{
                p: ({ children }) => (
                  <p className="text-body mb-2 text-text-primary last:mb-0">{children}</p>
                ),
                code: ({ children, className }) => {
                  const isInline = !className
                  if (isInline) {
                    return (
                      <code className="rounded bg-surface-overlay px-1.5 py-0.5 font-mono text-sm text-accent-bright">
                        {children}
                      </code>
                    )
                  }
                  return (
                    <code className="block overflow-x-auto rounded-lg bg-surface-ground p-3 font-mono text-sm text-text-secondary">
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="my-3 overflow-hidden rounded-lg border border-border bg-surface-ground">
                    {children}
                  </pre>
                )
              }}
            >
              {text}
            </Markdown>
          </div>
        ) : (
          // Typing indicator when no text yet
          <TypingIndicator />
        )}

        {/* Cursor blink */}
        {text && <span className="inline-block h-4 w-0.5 animate-pulse bg-accent" />}
      </div>
    </div>
  )
}

/** Tool call status pill */
function ToolCallStatus({ toolCall }: { toolCall: ActiveToolCall }): React.JSX.Element {
  const isRunning = toolCall.status === 'running'

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
        isRunning
          ? 'border border-accent/20 bg-accent-dim/50 text-accent'
          : 'border border-success/20 bg-success-dim/50 text-success'
      }`}
    >
      {isRunning ? (
        <span className="inline-block h-2 w-2 animate-spin rounded-full border border-accent border-t-transparent" />
      ) : (
        <span>&#10003;</span>
      )}
      <span>{formatToolName(toolCall.name)}</span>
    </div>
  )
}

/** Typing indicator dots */
function TypingIndicator(): React.JSX.Element {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-text-disabled"
          style={{
            animation: `pulse 1.4s infinite ease-in-out ${i * 0.16}s`
          }}
        />
      ))}
    </div>
  )
}

/** Format tool name for display */
function formatToolName(name: string): string {
  const displayNames: Record<string, string> = {
    write_presentation_code: 'Writing code...',
    edit_presentation_code: 'Editing code...',
    compile_pptx: 'Compiling slides...',
    read_local_file: 'Reading file...',
    web_search: 'Searching web...',
    fetch_image: 'Fetching image...'
  }
  return displayNames[name] || name.replace(/_/g, ' ')
}
