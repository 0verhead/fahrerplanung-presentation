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
 *
 * Multi-step Agent Loop:
 *   The AI can autonomously chain multiple steps:
 *   1. Analyze user request
 *   2. Plan design direction
 *   3. Write TSX code (write_presentation_code tool)
 *   4. Compile presentation (compile_pptx tool)
 *   5. Check slide previews
 *   6. Self-correct issues (edit_presentation_code tool)
 *   7. Present final result
 *
 *   Tool errors are handled gracefully with automatic retry logic.
 *   Step progress is forwarded to the renderer for UI feedback.
 */

import { streamText, stepCountIs } from 'ai'
import type { LanguageModelUsage, StepResult } from 'ai'
import type { ModelMessage } from '@ai-sdk/provider-utils'

import { createLanguageModel } from './ai-provider-registry'
import { createEncoreTools, type EncoreToolSet } from './ai-tools'
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

/** Maximum retries for a single tool that returns an error result */
const MAX_TOOL_RETRIES = 2

/** Current TSX source — tracked so the system prompt can include it as context */
let currentTsxSource: string | undefined

/** Current step number for tracking multi-step progress */
let currentStepNumber = 0

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
 * Implements a multi-step agent loop where the AI can autonomously:
 * 1. Analyze user request and plan design direction
 * 2. Write TSX code using write_presentation_code tool
 * 3. Compile with compile_pptx tool
 * 4. Check results and self-correct with edit_presentation_code
 * 5. Present final result
 *
 * Tool errors are handled gracefully — the AI receives the error and can retry.
 * Step progress is forwarded to the renderer for UI indicators.
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
      error: 'No AI provider configured. Please set an API key in Settings.',
      isRetryable: false
    })
    return
  }

  // Abort any in-flight generation
  abortGeneration()

  // Create a new abort controller for this generation
  const abortController = new AbortController()
  activeAbortController = abortController

  // Reset step counter
  currentStepNumber = 0

  // Append user message to history
  const userModelMessage: ModelMessage = {
    role: 'user',
    content: userMessage
  }
  conversationHistory.push(userModelMessage)

  // Track tool call retries for error handling
  const toolRetryCount = new Map<string, number>()

  try {
    // Create language model from provider config
    const model = createLanguageModel(config)

    // Emit step-start for first step
    currentStepNumber = 1
    onEvent({ type: 'step-start', stepNumber: 1, maxSteps: MAX_AGENT_STEPS })

    // Execute the streaming pipeline
    const result = streamText({
      model,
      system: getSystemPrompt(currentTsxSource),
      messages: conversationHistory,
      abortSignal: abortController.signal,

      // Multi-step agent loop: allow up to MAX_AGENT_STEPS autonomous steps.
      // The AI can chain operations: analyze -> plan -> write -> compile -> verify -> adjust
      stopWhen: stepCountIs(MAX_AGENT_STEPS),

      // Configure retry behavior at the provider level
      maxRetries: MAX_TOOL_RETRIES,

      // AI tools for presentation generation, file I/O, and web access.
      // Tool lifecycle events are forwarded to the renderer for UI indicators.
      // Tool errors are returned to the AI (not thrown) so it can self-correct.
      tools: createEncoreTools((toolEvent) => {
        // Track retries for tools that fail
        if (toolEvent.type === 'tool-call-result') {
          const result = toolEvent.result as { success?: boolean; error?: string }
          if (result && !result.success && result.error) {
            const retryKey = toolEvent.toolName
            const count = (toolRetryCount.get(retryKey) ?? 0) + 1
            toolRetryCount.set(retryKey, count)

            // If we've exceeded retry limit for this tool, log a warning
            if (count > MAX_TOOL_RETRIES) {
              console.warn(
                `Tool ${toolEvent.toolName} has failed ${count} times. ` +
                  `AI will need to try a different approach.`
              )
            }
          }
        }

        onEvent({
          type: toolEvent.type,
          toolCallId: toolEvent.toolCallId,
          toolName: toolEvent.toolName,
          ...(toolEvent.result !== undefined ? { result: toolEvent.result } : {})
        } as AIStreamEvent)
      }),

      // Called when each step finishes (useful for tracking multi-step progress)
      onStepFinish(stepResult: StepResult<EncoreToolSet>) {
        const usageInfo = normalizeUsage(stepResult.usage)
        const toolCallCount = stepResult.toolCalls?.length ?? 0

        onEvent({
          type: 'step-finish',
          stepNumber: currentStepNumber,
          stepType: stepResult.finishReason,
          usage: usageInfo,
          toolCallCount
        })

        // Increment step counter and emit step-start for next step if not done
        if (stepResult.finishReason === 'tool-calls') {
          currentStepNumber++
          onEvent({
            type: 'step-start',
            stepNumber: currentStepNumber,
            maxSteps: MAX_AGENT_STEPS
          })
        }
      },

      // Called when generation finishes (all steps complete)
      async onFinish(event) {
        const usageInfo = normalizeUsage(event.totalUsage)

        // Get the response messages for conversation history
        // This includes tool calls/results which are essential for multi-step continuity
        const response = await event.response
        const responseMessages = response.messages

        // Append all response messages to conversation history
        // This preserves tool calls and results for future context
        for (const msg of responseMessages) {
          conversationHistory.push(msg as ModelMessage)
        }

        onEvent({
          type: 'finish',
          finishReason: event.finishReason,
          usage: usageInfo,
          text: event.text,
          totalSteps: currentStepNumber
        })

        activeAbortController = null
      },

      // Called on errors during streaming
      onError({ error }) {
        const message = error instanceof Error ? error.message : String(error)

        // Determine if error is retryable (network issues, rate limits)
        const isRetryable =
          message.includes('rate limit') ||
          message.includes('timeout') ||
          message.includes('network') ||
          message.includes('ECONNREFUSED') ||
          message.includes('503') ||
          message.includes('429')

        onEvent({ type: 'error', error: message, isRetryable })
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
      onEvent({
        type: 'finish',
        finishReason: 'abort',
        usage: emptyUsage(),
        text: '',
        totalSteps: currentStepNumber
      })
      return
    }

    const message = err instanceof Error ? err.message : String(err)

    // Determine if the error is retryable
    const isRetryable =
      message.includes('rate limit') ||
      message.includes('timeout') ||
      message.includes('network') ||
      message.includes('ECONNREFUSED') ||
      message.includes('503') ||
      message.includes('429')

    onEvent({ type: 'error', error: message, isRetryable })
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
