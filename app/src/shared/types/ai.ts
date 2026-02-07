/**
 * Shared AI types used across main, preload, and renderer processes.
 *
 * These types define the contract for IPC communication between
 * the renderer (chat UI) and main process (AI SDK pipeline).
 */

// ---------------------------------------------------------------------------
// Provider configuration
// ---------------------------------------------------------------------------

/** Supported AI provider identifiers */
export type AIProviderType = 'openrouter' | 'anthropic' | 'openai'

/** Configuration for a single AI provider */
export interface AIProviderConfig {
  type: AIProviderType
  apiKey: string
  /** Model identifier — e.g. "anthropic/claude-sonnet-4-20250514" for OpenRouter */
  modelId: string
}

/** Default model per provider */
export const DEFAULT_MODELS: Record<AIProviderType, string> = {
  openrouter: 'anthropic/claude-sonnet-4-20250514',
  anthropic: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o'
}

// ---------------------------------------------------------------------------
// Chat messages (renderer <-> main IPC contract)
// ---------------------------------------------------------------------------

/**
 * Simplified message format for IPC transport.
 * The main process converts these to/from AI SDK's ModelMessage internally.
 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  /** ISO timestamp */
  createdAt: string
}

// ---------------------------------------------------------------------------
// Streaming protocol (main -> renderer)
// ---------------------------------------------------------------------------

/**
 * Discriminated union of events streamed from main to renderer during generation.
 * Sent over IPC as individual messages.
 */
export type AIStreamEvent =
  | { type: 'text-delta'; textDelta: string }
  | { type: 'tool-call-start'; toolCallId: string; toolName: string }
  | { type: 'tool-call-result'; toolCallId: string; toolName: string; result: unknown }
  | { type: 'step-start'; stepNumber: number; maxSteps: number }
  | {
      type: 'step-finish'
      stepNumber: number
      stepType: string
      usage: AIUsageInfo
      toolCallCount: number
    }
  | { type: 'finish'; finishReason: string; usage: AIUsageInfo; text: string; totalSteps: number }
  | { type: 'error'; error: string; isRetryable?: boolean }

/** Token usage information (mirrors AI SDK v6 LanguageModelUsage naming) */
export interface AIUsageInfo {
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

// ---------------------------------------------------------------------------
// IPC channel names
// ---------------------------------------------------------------------------

/** All AI-related IPC channel constants */
export const AI_IPC_CHANNELS = {
  /** Renderer -> Main: send a chat message */
  SEND_MESSAGE: 'ai:send-message',
  /** Main -> Renderer: stream events */
  STREAM_EVENT: 'ai:stream-event',
  /** Renderer -> Main: abort current generation */
  ABORT: 'ai:abort',
  /** Renderer -> Main: update provider config */
  SET_PROVIDER: 'ai:set-provider',
  /** Renderer -> Main: get current provider config */
  GET_PROVIDER: 'ai:get-provider',
  /** Renderer -> Main: clear conversation history */
  CLEAR_HISTORY: 'ai:clear-history',
  /** Renderer -> Main: get conversation history */
  GET_HISTORY: 'ai:get-history',
  /** Renderer -> Main: get current TSX source */
  GET_TSX: 'ai:get-tsx',
  /** Renderer -> Main: set TSX source (from user edits) */
  SET_TSX: 'ai:set-tsx',
  /** Main -> Renderer: TSX code has changed (from AI or compilation) */
  TSX_CHANGED: 'ai:tsx-changed',
  /** Main -> Renderer: Slide preview data updated (after compilation) */
  SLIDES_UPDATED: 'ai:slides-updated',
  /** Renderer -> Main: get current slide preview data */
  GET_SLIDES: 'ai:get-slides',
  /** Renderer -> Main: trigger manual compilation */
  TRIGGER_COMPILE: 'ai:trigger-compile',
  /** Renderer -> Main: get available brand kits */
  GET_BRAND_KITS: 'ai:get-brand-kits',
  /** Renderer -> Main: get current brand kit */
  GET_BRAND_KIT: 'ai:get-brand-kit',
  /** Renderer -> Main: set active brand kit */
  SET_BRAND_KIT: 'ai:set-brand-kit',
  /** Renderer -> Main: set theme variant */
  SET_THEME_VARIANT: 'ai:set-theme-variant',
  /** Renderer -> Main: get theme variant */
  GET_THEME_VARIANT: 'ai:get-theme-variant',
  /** Renderer -> Main: export PPTX with save dialog */
  EXPORT_PPTX: 'ai:export-pptx',
  /** Renderer -> Main: export as PDF with save dialog */
  EXPORT_PDF: 'ai:export-pdf',
  /** Renderer -> Main: open PPTX file with system app */
  OPEN_PPTX: 'ai:open-pptx',
  /** Renderer -> Main: reveal file in system file explorer */
  REVEAL_IN_FINDER: 'ai:reveal-in-finder',
  /** Renderer -> Main: check if PDF export is available */
  IS_PDF_EXPORT_AVAILABLE: 'ai:is-pdf-export-available',

  // Settings channels
  /** Renderer -> Main: get all settings */
  GET_SETTINGS: 'settings:get-all',
  /** Renderer -> Main: set API key for a provider */
  SET_API_KEY: 'settings:set-api-key',
  /** Renderer -> Main: remove API key for a provider */
  REMOVE_API_KEY: 'settings:remove-api-key',
  /** Renderer -> Main: set preferred model for a provider */
  SET_PREFERRED_MODEL: 'settings:set-preferred-model',
  /** Renderer -> Main: set UI preference */
  SET_UI_PREFERENCE: 'settings:set-ui-preference',
  /** Renderer -> Main: set export preference */
  SET_EXPORT_PREFERENCE: 'settings:set-export-preference',
  /** Renderer -> Main: open settings window/modal */
  OPEN_SETTINGS: 'settings:open'
} as const

// ---------------------------------------------------------------------------
// Code editor types
// ---------------------------------------------------------------------------

/** Event emitted when TSX source changes */
export interface TsxChangedEvent {
  /** The new TSX source code */
  code: string
  /** Source of the change */
  source: 'ai' | 'user' | 'initial'
  /** Optional: the previous code (for diff view) */
  previousCode?: string
}

// ---------------------------------------------------------------------------
// Slide preview types
// ---------------------------------------------------------------------------

/** A single slide thumbnail */
export interface SlideThumbnail {
  /** 0-based slide index */
  slideIndex: number
  /** base64-encoded PNG data URI */
  dataUri: string
  /** Slide width in pixels (for aspect ratio) */
  width: number
  /** Slide height in pixels */
  height: number
}

/** Current state of the slide preview */
export interface SlidePreviewState {
  /** Whether slides are available */
  hasSlides: boolean
  /** Whether compilation is in progress */
  isCompiling: boolean
  /** Number of slides */
  slideCount: number
  /** Slide thumbnails (may be empty if not yet compiled) */
  slides: SlideThumbnail[]
  /** Last compilation error (if any) */
  error?: string
  /** Compilation warnings */
  warnings?: string[]
  /** Path to the generated PPTX file */
  pptxPath?: string
}

/** Event emitted when slide previews are updated */
export interface SlidesUpdatedEvent {
  /** The new slide preview state */
  state: SlidePreviewState
}

// ---------------------------------------------------------------------------
// IPC request/response payloads
// ---------------------------------------------------------------------------

/** Payload for ai:send-message */
export interface SendMessagePayload {
  message: string
  /** Optional: override the session's provider for this request */
  providerConfig?: AIProviderConfig
}

/** Payload for ai:set-provider */
export interface SetProviderPayload {
  config: AIProviderConfig
}

/** Response for ai:get-provider */
export interface GetProviderResponse {
  config: AIProviderConfig | null
}

// ---------------------------------------------------------------------------
// Brand kit types (for IPC)
// ---------------------------------------------------------------------------

/** Metadata about a brand kit (for listing) */
export interface BrandKitMeta {
  id: string
  name: string
  description?: string
}

/** Response for ai:get-brand-kits */
export interface GetBrandKitsResponse {
  kits: BrandKitMeta[]
  activeId: string
  activeTheme: 'dark' | 'light'
}

/** Payload for ai:set-brand-kit */
export interface SetBrandKitPayload {
  brandKitId: string
}

/** Payload for ai:set-theme-variant */
export interface SetThemeVariantPayload {
  variant: 'dark' | 'light'
}

// ---------------------------------------------------------------------------
// Export types
// ---------------------------------------------------------------------------

/** Payload for ai:export-pptx */
export interface ExportPptxPayload {
  /** Path to the source PPTX file (from compilation) */
  sourcePath: string
  /** Suggested filename (without path) */
  suggestedName?: string
  /** Whether to auto-open after export (default: true) */
  autoOpen?: boolean
}

/** Response for ai:export-pptx */
export interface ExportPptxResponse {
  success: boolean
  /** Path where the file was saved */
  exportedPath?: string
  /** Error message if failed */
  error?: string
  /** Whether the file was opened */
  opened?: boolean
}

/** Payload for ai:export-pdf */
export interface ExportPdfPayload {
  /** Path to the source PPTX file */
  sourcePath: string
  /** Suggested filename (without path) */
  suggestedName?: string
  /** Whether to auto-open after export (default: true) */
  autoOpen?: boolean
}

/** Response for ai:export-pdf */
export interface ExportPdfResponse {
  success: boolean
  exportedPath?: string
  error?: string
  opened?: boolean
}

/** Payload for ai:open-pptx */
export interface OpenPptxPayload {
  filePath: string
}

/** Payload for ai:reveal-in-finder */
export interface RevealInFinderPayload {
  filePath: string
}

// ---------------------------------------------------------------------------
// Settings types
// ---------------------------------------------------------------------------

/** Stored API keys */
export interface StoredApiKeys {
  openrouter?: string
  anthropic?: string
  openai?: string
}

/** UI preferences */
export interface UIPreferences {
  theme: 'dark' | 'light' | 'system'
  showLineNumbers: boolean
  wordWrap: boolean
  editorFontSize: number
  autoCompile: boolean
}

/** Export preferences */
export interface ExportPreferences {
  exportDirectory?: string
  autoOpen: boolean
  defaultFormat: 'pptx' | 'pdf'
}

/** Brand preferences */
export interface BrandPreferences {
  activeBrandKitId: string
  activeThemeVariant: 'dark' | 'light'
}

/** Response for settings:get-all */
export interface GetAllSettingsResponse {
  apiKeys: StoredApiKeys
  currentProvider: AIProviderConfig | null
  uiPreferences: UIPreferences
  exportPreferences: ExportPreferences
  brandPreferences: BrandPreferences
  modelPreferences: Record<AIProviderType, string>
  configuredProviders: AIProviderType[]
}

/** Payload for settings:set-api-key */
export interface SetApiKeyPayload {
  provider: AIProviderType
  apiKey: string
}

/** Payload for settings:remove-api-key */
export interface RemoveApiKeyPayload {
  provider: AIProviderType
}

/** Payload for settings:set-preferred-model */
export interface SetPreferredModelPayload {
  provider: AIProviderType
  modelId: string
}

/** Payload for settings:set-ui-preference */
export interface SetUIPreferencePayload {
  key: keyof UIPreferences
  value: UIPreferences[keyof UIPreferences]
}

/** Payload for settings:set-export-preference */
export interface SetExportPreferencePayload {
  key: keyof ExportPreferences
  value: ExportPreferences[keyof ExportPreferences]
}
