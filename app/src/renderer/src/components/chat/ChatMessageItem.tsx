/**
 * ChatMessageItem — Individual chat message with markdown rendering
 */

import Markdown from 'react-markdown'
import type { ChatMessage } from '../../../../shared/types/ai'

interface ChatMessageItemProps {
  message: ChatMessage
}

export function ChatMessageItem({ message }: ChatMessageItemProps): React.JSX.Element {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animation: 'slide-up 200ms ease-out' }}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isUser ? 'bg-accent-dim text-accent' : 'bg-surface-elevated text-text-secondary'
        }`}
      >
        {isUser ? <UserIcon /> : <span className="text-sm">&#10024;</span>}
      </div>

      {/* Message content */}
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 ${
          isUser ? 'bg-accent-dim/60 text-text-primary' : 'bg-surface-raised text-text-primary'
        }`}
      >
        {isUser ? (
          <p className="text-body whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-encore">
            <Markdown
              components={{
                // Custom components for markdown elements
                p: ({ children }) => <p className="text-body mb-2 last:mb-0">{children}</p>,
                h1: ({ children }) => (
                  <h1 className="text-display-2 mb-3 mt-4 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-display-3 mb-2 mt-3 first:mt-0">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-heading mb-2 mt-3 first:mt-0">{children}</h3>
                ),
                ul: ({ children }) => <ul className="my-2 list-disc pl-5 text-body">{children}</ul>,
                ol: ({ children }) => (
                  <ol className="my-2 list-decimal pl-5 text-body">{children}</ol>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
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
                ),
                blockquote: ({ children }) => (
                  <blockquote className="my-3 border-l-2 border-accent pl-4 italic text-text-secondary">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-accent underline decoration-accent/30 transition-fast hover:decoration-accent"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-text-primary">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                hr: () => <hr className="my-4 border-border" />
              }}
            >
              {message.content}
            </Markdown>
          </div>
        )}

        {/* Timestamp */}
        <div className={`mt-2 text-xs text-text-disabled ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  )
}

/** Format ISO timestamp to readable time */
function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/** User icon SVG */
function UserIcon(): React.JSX.Element {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
