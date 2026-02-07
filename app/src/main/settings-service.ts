/**
 * Settings Service — Persistent settings management for Encore
 *
 * Uses electron-store for persistent storage of:
 * - API keys (OpenRouter, Anthropic, OpenAI)
 * - Current provider configuration
 * - UI preferences
 * - Export preferences
 * - Brand preferences
 *
 * Settings are stored in the user's app data directory.
 */

import Store from 'electron-store'
import type { AIProviderConfig, AIProviderType } from '../shared/types/ai'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** API keys for each provider (stored securely) */
export interface StoredApiKeys {
  openrouter?: string
  anthropic?: string
  openai?: string
}

/** UI preferences */
export interface StoredUIPreferences {
  theme: 'dark' | 'light' | 'system'
  showLineNumbers: boolean
  wordWrap: boolean
  editorFontSize: number
  autoCompile: boolean
}

/** Export preferences */
export interface StoredExportPreferences {
  exportDirectory?: string
  autoOpen: boolean
  defaultFormat: 'pptx' | 'pdf'
}

/** Brand preferences */
export interface StoredBrandPreferences {
  activeBrandKitId: string
  activeThemeVariant: 'dark' | 'light'
}

/** Full settings schema */
export interface SettingsSchema {
  // API keys (stored per provider)
  apiKeys: StoredApiKeys

  // Current active provider config
  currentProvider: AIProviderConfig | null

  // UI preferences
  uiPreferences: StoredUIPreferences

  // Export preferences
  exportPreferences: StoredExportPreferences

  // Brand preferences
  brandPreferences: StoredBrandPreferences

  // Model preferences per provider
  modelPreferences: Record<AIProviderType, string>
}

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------

const DEFAULT_UI_PREFERENCES: StoredUIPreferences = {
  theme: 'dark',
  showLineNumbers: true,
  wordWrap: true,
  editorFontSize: 13,
  autoCompile: true
}

const DEFAULT_EXPORT_PREFERENCES: StoredExportPreferences = {
  autoOpen: true,
  defaultFormat: 'pptx'
}

const DEFAULT_BRAND_PREFERENCES: StoredBrandPreferences = {
  activeBrandKitId: 'neutral',
  activeThemeVariant: 'dark'
}

const DEFAULT_MODEL_PREFERENCES: Record<AIProviderType, string> = {
  openrouter: 'anthropic/claude-sonnet-4-20250514',
  anthropic: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o'
}

// ---------------------------------------------------------------------------
// Store instance
// ---------------------------------------------------------------------------

const store = new Store<SettingsSchema>({
  name: 'encore-settings',
  defaults: {
    apiKeys: {},
    currentProvider: null,
    uiPreferences: DEFAULT_UI_PREFERENCES,
    exportPreferences: DEFAULT_EXPORT_PREFERENCES,
    brandPreferences: DEFAULT_BRAND_PREFERENCES,
    modelPreferences: DEFAULT_MODEL_PREFERENCES
  },
  // Clear invalid entries
  clearInvalidConfig: true
})

// ---------------------------------------------------------------------------
// API Key Management
// ---------------------------------------------------------------------------

/**
 * Get all stored API keys
 */
export function getApiKeys(): StoredApiKeys {
  return store.get('apiKeys', {})
}

/**
 * Get API key for a specific provider
 */
export function getApiKey(provider: AIProviderType): string | undefined {
  const keys = store.get('apiKeys', {})
  return keys[provider]
}

/**
 * Set API key for a provider
 */
export function setApiKey(provider: AIProviderType, apiKey: string): void {
  const keys = store.get('apiKeys', {})
  keys[provider] = apiKey
  store.set('apiKeys', keys)
}

/**
 * Remove API key for a provider
 */
export function removeApiKey(provider: AIProviderType): void {
  const keys = store.get('apiKeys', {})
  delete keys[provider]
  store.set('apiKeys', keys)
}

/**
 * Check if a provider has an API key configured
 */
export function hasApiKey(provider: AIProviderType): boolean {
  const key = getApiKey(provider)
  return !!key && key.length > 0
}

/**
 * Get all providers that have API keys configured
 */
export function getConfiguredProviders(): AIProviderType[] {
  const keys = store.get('apiKeys', {})
  return (Object.keys(keys) as AIProviderType[]).filter((p) => keys[p] && keys[p]!.length > 0)
}

// ---------------------------------------------------------------------------
// Provider Configuration
// ---------------------------------------------------------------------------

/**
 * Get the current provider configuration
 */
export function getCurrentProvider(): AIProviderConfig | null {
  return store.get('currentProvider', null)
}

/**
 * Set the current provider configuration
 */
export function setCurrentProvider(config: AIProviderConfig | null): void {
  store.set('currentProvider', config)

  // Also update the API key for this provider
  if (config) {
    setApiKey(config.type, config.apiKey)
  }
}

/**
 * Get the preferred model for a provider
 */
export function getPreferredModel(provider: AIProviderType): string {
  const prefs = store.get('modelPreferences', DEFAULT_MODEL_PREFERENCES)
  return prefs[provider] || DEFAULT_MODEL_PREFERENCES[provider]
}

/**
 * Set the preferred model for a provider
 */
export function setPreferredModel(provider: AIProviderType, modelId: string): void {
  const prefs = store.get('modelPreferences', DEFAULT_MODEL_PREFERENCES)
  prefs[provider] = modelId
  store.set('modelPreferences', prefs)
}

// ---------------------------------------------------------------------------
// UI Preferences
// ---------------------------------------------------------------------------

/**
 * Get UI preferences
 */
export function getUIPreferences(): StoredUIPreferences {
  return store.get('uiPreferences', DEFAULT_UI_PREFERENCES)
}

/**
 * Set a UI preference
 */
export function setUIPreference<K extends keyof StoredUIPreferences>(
  key: K,
  value: StoredUIPreferences[K]
): void {
  const prefs = store.get('uiPreferences', DEFAULT_UI_PREFERENCES)
  prefs[key] = value
  store.set('uiPreferences', prefs)
}

/**
 * Set all UI preferences at once
 */
export function setUIPreferences(prefs: Partial<StoredUIPreferences>): void {
  const current = store.get('uiPreferences', DEFAULT_UI_PREFERENCES)
  store.set('uiPreferences', { ...current, ...prefs })
}

// ---------------------------------------------------------------------------
// Export Preferences
// ---------------------------------------------------------------------------

/**
 * Get export preferences
 */
export function getExportPreferences(): StoredExportPreferences {
  return store.get('exportPreferences', DEFAULT_EXPORT_PREFERENCES)
}

/**
 * Set an export preference
 */
export function setExportPreference<K extends keyof StoredExportPreferences>(
  key: K,
  value: StoredExportPreferences[K]
): void {
  const prefs = store.get('exportPreferences', DEFAULT_EXPORT_PREFERENCES)
  prefs[key] = value
  store.set('exportPreferences', prefs)
}

/**
 * Set all export preferences at once
 */
export function setExportPreferences(prefs: Partial<StoredExportPreferences>): void {
  const current = store.get('exportPreferences', DEFAULT_EXPORT_PREFERENCES)
  store.set('exportPreferences', { ...current, ...prefs })
}

// ---------------------------------------------------------------------------
// Brand Preferences
// ---------------------------------------------------------------------------

/**
 * Get brand preferences
 */
export function getBrandPreferences(): StoredBrandPreferences {
  return store.get('brandPreferences', DEFAULT_BRAND_PREFERENCES)
}

/**
 * Set a brand preference
 */
export function setBrandPreference<K extends keyof StoredBrandPreferences>(
  key: K,
  value: StoredBrandPreferences[K]
): void {
  const prefs = store.get('brandPreferences', DEFAULT_BRAND_PREFERENCES)
  prefs[key] = value
  store.set('brandPreferences', prefs)
}

// ---------------------------------------------------------------------------
// Full Settings
// ---------------------------------------------------------------------------

/** Response type for getAllSettings */
export interface AllSettingsResponse {
  apiKeys: StoredApiKeys
  currentProvider: AIProviderConfig | null
  uiPreferences: StoredUIPreferences
  exportPreferences: StoredExportPreferences
  brandPreferences: StoredBrandPreferences
  modelPreferences: Record<AIProviderType, string>
  configuredProviders: AIProviderType[]
}

/**
 * Get all settings at once (for initial load)
 */
export function getAllSettings(): AllSettingsResponse {
  return {
    apiKeys: getApiKeys(),
    currentProvider: getCurrentProvider(),
    uiPreferences: getUIPreferences(),
    exportPreferences: getExportPreferences(),
    brandPreferences: getBrandPreferences(),
    modelPreferences: store.get('modelPreferences', DEFAULT_MODEL_PREFERENCES),
    configuredProviders: getConfiguredProviders()
  }
}

/**
 * Reset all settings to defaults
 */
export function resetAllSettings(): void {
  store.clear()
}

/**
 * Get the path to the settings file (for debugging)
 */
export function getSettingsPath(): string {
  return store.path
}
