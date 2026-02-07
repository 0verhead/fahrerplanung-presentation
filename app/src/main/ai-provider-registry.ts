/**
 * AI Provider Registry
 *
 * Manages provider instances for OpenRouter, Anthropic, and OpenAI.
 * Creates and caches provider instances, returning language model objects
 * that the AI SDK's `streamText()` can consume directly.
 */

import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModelV3 } from '@ai-sdk/provider'

import type { AIProviderType, AIProviderConfig } from '../shared/types/ai'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProviderInstance {
  type: AIProviderType
  apiKey: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/** Cached provider instances keyed by `type:apiKey` */
const providerCache = new Map<string, ProviderInstance>()

function cacheKey(type: AIProviderType, apiKey: string): string {
  return `${type}:${apiKey}`
}

/**
 * Get or create a provider instance for the given configuration.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOrCreateProvider(type: AIProviderType, apiKey: string): any {
  const key = cacheKey(type, apiKey)
  const cached = providerCache.get(key)
  if (cached) return cached.provider

  let provider: unknown
  switch (type) {
    case 'openrouter':
      provider = createOpenRouter({
        apiKey,
        compatibility: 'strict'
      })
      break
    case 'anthropic':
      provider = createAnthropic({ apiKey })
      break
    case 'openai':
      provider = createOpenAI({ apiKey })
      break
    default:
      throw new Error(`Unknown provider type: ${type as string}`)
  }

  providerCache.set(key, { type, apiKey, provider })
  return provider
}

/**
 * Create a language model instance from provider configuration.
 *
 * @returns A LanguageModelV3 that can be passed directly to `streamText({ model })`.
 */
export function createLanguageModel(config: AIProviderConfig): LanguageModelV3 {
  const provider = getOrCreateProvider(config.type, config.apiKey)
  // All three providers follow the same callable pattern: provider(modelId)
  return provider(config.modelId) as LanguageModelV3
}

/**
 * Clear cached provider instances (e.g. when API key changes).
 */
export function clearProviderCache(): void {
  providerCache.clear()
}

/**
 * Remove a specific provider from the cache.
 */
export function removeProviderFromCache(type: AIProviderType, apiKey: string): void {
  providerCache.delete(cacheKey(type, apiKey))
}
