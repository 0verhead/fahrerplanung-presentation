import { useEffect, useState } from 'react'

interface ProviderInfo {
  type: 'openrouter' | 'anthropic' | 'openai'
  modelId: string
}

/**
 * StatusBar — Bottom status bar showing current model, token usage, and generation status.
 * Follows the app design system with subtle, unobtrusive styling.
 */
export function StatusBar(): React.JSX.Element {
  const [provider, setProvider] = useState<ProviderInfo | null>(null)

  // Load provider info on mount
  useEffect(() => {
    const loadProvider = async (): Promise<void> => {
      try {
        const result = await window.api.getProvider()
        if (result.config) {
          setProvider({
            type: result.config.type,
            modelId: result.config.modelId
          })
        } else {
          setProvider(null)
        }
      } catch {
        // Provider not configured yet
        setProvider(null)
      }
    }
    loadProvider()
  }, [])

  const getProviderIcon = (type: ProviderInfo['type']): React.JSX.Element => {
    switch (type) {
      case 'anthropic':
        return (
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.152 6.75h3.36L13.5 24h-3.36l7.012-17.25zM6.848 6.75L0 24h3.36l1.372-3.375h7.536L13.64 24h3.36L10.152 6.75H6.848zm.924 11.625l2.728-6.705 2.728 6.705H7.772z" />
          </svg>
        )
      case 'openai':
        return (
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
          </svg>
        )
      default:
        return (
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        )
    }
  }

  const getProviderLabel = (type: ProviderInfo['type']): string => {
    switch (type) {
      case 'anthropic':
        return 'Anthropic'
      case 'openai':
        return 'OpenAI'
      default:
        return 'OpenRouter'
    }
  }

  return (
    <div className="flex h-6 flex-shrink-0 items-center justify-between border-t border-border bg-surface-base px-3">
      {/* Left section: Provider and model info */}
      <div className="flex items-center gap-3 text-[10px] text-text-tertiary">
        {provider ? (
          <>
            <div className="flex items-center gap-1.5">
              {getProviderIcon(provider.type)}
              <span>{getProviderLabel(provider.type)}</span>
            </div>
            <span className="text-text-disabled">•</span>
            <span className="font-mono text-text-secondary">{provider.modelId}</span>
          </>
        ) : (
          <span className="text-text-disabled">No API key configured</span>
        )}
      </div>

      {/* Right section: Version and keyboard hint */}
      <div className="flex items-center gap-3 text-[10px] text-text-disabled">
        <div className="flex items-center gap-1">
          <kbd className="rounded bg-surface-overlay px-1 py-0.5 font-mono text-[9px] text-text-tertiary">
            ⌘B
          </kbd>
          <span>toggle code</span>
        </div>
        <span className="text-text-disabled">•</span>
        <span>Encore</span>
      </div>
    </div>
  )
}
