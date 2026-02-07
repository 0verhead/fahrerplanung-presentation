/**
 * AI Service — Core streamText() Pipeline
 *
 * Manages conversation state and streams AI responses using the Vercel AI SDK v6.
 * Runs in the Electron main process. Communicates with the renderer via IPC events.
 *
 * Architecture:
 *   Renderer --[IPC]--> ai-service.streamChat() --[AI SDK]--> Provider API
 *                                                         <-- streaming events
 *   Renderer <--[IPC]-- onTextDelta / onToolCall / etc.
 */

import { streamText, stepCountIs } from 'ai'
import type { LanguageModelUsage } from 'ai'
import type { ModelMessage } from '@ai-sdk/provider-utils'

import { createLanguageModel } from './ai-provider-registry'
import type { AIProviderConfig, AIStreamEvent, AIUsageInfo, ChatMessage } from '../shared/types/ai'
import { DEFAULT_MODELS } from '../shared/types/ai'
import { getSystemPrompt } from '../shared/prompts/system'

// ---------------------------------------------------------------------------
// Session state
// ---------------------------------------------------------------------------

/** In-memory conversation history (ModelMessage format for AI SDK) */
let conversationHistory: ModelMessage[] = []

/** Current provider configuration */
let currentProviderConfig: AIProviderConfig | null = null

/** AbortController for the active generation — null when idle */
let activeAbortController: AbortController | null = null

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Maximum autonomous agent steps before forcing stop */
const MAX_AGENT_STEPS = 10

/** Current TSX source — tracked so the system prompt can include it as context */
let currentTsxSource: string | undefined

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Set the active AI provider configuration.
 */
export function setProviderConfig(config: AIProviderConfig): void {
  currentProviderConfig = config
}

/**
 * Get the current provider configuration.
 */
export function getProviderConfig(): AIProviderConfig | null {
  return currentProviderConfig
}

/**
 * Get conversation history as simplified ChatMessage[] for the renderer.
 */
export function getHistory(): ChatMessage[] {
  return conversationHistory.map((msg, i) => ({
    id: `msg-${i}`,
    role: msg.role === 'tool' ? 'assistant' : (msg.role as 'user' | 'assistant' | 'system'),
    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
    createdAt: new Date().toISOString()
  }))
}

/**
 * Clear conversation history.
 */
export function clearHistory(): void {
  conversationHistory = []
}

/**
 * Update the current TSX source code context.
 * This is injected into the system prompt so the AI knows the current state.
 */
export function setCurrentTsx(tsx: string | undefined): void {
  currentTsxSource = tsx
}

/**
 * Abort the current active generation.
 */
export function abortGeneration(): void {
  if (activeAbortController) {
    activeAbortController.abort()
    activeAbortController = null
  }
}

/**
 * Stream a chat response for the given user message.
 *
 * @param userMessage - The user's text message
 * @param providerOverride - Optional one-time provider override
 * @param onEvent - Callback invoked for each stream event (forwarded to renderer via IPC)
 */
export async function streamChat(
  userMessage: string,
  providerOverride: AIProviderConfig | undefined,
  onEvent: (event: AIStreamEvent) => void
): Promise<void> {
  // Resolve provider config
  const config = providerOverride ?? currentProviderConfig
  if (!config) {
    onEvent({
      type: 'error',
      error: 'No AI provider configured. Please set an API key in Settings.'
    })
    return
  }

  // Abort any in-flight generation
  abortGeneration()

  // Create a new abort controller for this generation
  const abortController = new AbortController()
  activeAbortController = abortController

  // Append user message to history
  const userModelMessage: ModelMessage = {
    role: 'user',
    content: userMessage
  }
  conversationHistory.push(userModelMessage)

  try {
    // Create language model from provider config
    const model = createLanguageModel(config)

    // Execute the streaming pipeline
    const result = streamText({
      model,
      system: getSystemPrompt(currentTsxSource),
      messages: conversationHistory,
      abortSignal: abortController.signal,

      // Multi-step agent loop: allow up to MAX_AGENT_STEPS autonomous steps
      // In AI SDK v6, `stopWhen` with `stepCountIs(n)` replaces the old `maxSteps`
      stopWhen: stepCountIs(MAX_AGENT_STEPS),

      // Tools will be added in the "AI tool definitions" task.
      // For now, the pipeline works in pure text-generation mode.
      // tools: {},

      // Called when each step finishes (useful for tracking multi-step progress)
      onStepFinish(stepResult) {
        const usageInfo = normalizeUsage(stepResult.usage)
        onEvent({ type: 'step-finish', stepType: stepResult.finishReason, usage: usageInfo })
      },

      // Called when generation finishes (all steps complete)
      onFinish(event) {
        const usageInfo = normalizeUsage(event.totalUsage)
        onEvent({
          type: 'finish',
          finishReason: event.finishReason,
          usage: usageInfo,
          text: event.text
        })

        // Append assistant response to conversation history
        if (event.text) {
          const assistantMessage: ModelMessage = {
            role: 'assistant',
            content: event.text
          }
          conversationHistory.push(assistantMessage)
        }

        activeAbortController = null
      },

      // Called on errors during streaming
      onError({ error }) {
        const message = error instanceof Error ? error.message : String(error)
        onEvent({ type: 'error', error: message })
      }
    })

    // Consume the text stream and forward deltas to the renderer
    for await (const textDelta of result.textStream) {
      if (abortController.signal.aborted) break
      if (textDelta) {
        onEvent({ type: 'text-delta', textDelta })
      }
    }
  } catch (err: unknown) {
    // Don't report abort as an error
    if (err instanceof Error && err.name === 'AbortError') {
      onEvent({ type: 'finish', finishReason: 'abort', usage: emptyUsage(), text: '' })
      return
    }

    const message = err instanceof Error ? err.message : String(err)
    onEvent({ type: 'error', error: message })
  } finally {
    if (activeAbortController === abortController) {
      activeAbortController = null
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeUsage(usage: LanguageModelUsage): AIUsageInfo {
  return {
    inputTokens: usage.inputTokens ?? 0,
    outputTokens: usage.outputTokens ?? 0,
    totalTokens: usage.totalTokens ?? 0
  }
}

function emptyUsage(): AIUsageInfo {
  return { inputTokens: 0, outputTokens: 0, totalTokens: 0 }
}

// Re-export for convenience
export { DEFAULT_MODELS }
