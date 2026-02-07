/**
 * Settings Store — Manages user settings with Zustand
 *
 * Handles:
 * - API key management (OpenRouter, Anthropic, OpenAI)
 * - Current model selection
 * - UI preferences (theme, layout, etc.)
 * - Export preferences
 *
 * Syncs with main process via IPC for persistence.
 */

import { create } from 'zustand'
import type { AIProviderConfig, AIProviderType } from '../../../shared/types/ai'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** API keys for each provider */
export interface ApiKeys {
  openrouter?: string
  anthropic?: string
  openai?: string
}

/** UI preferences */
export interface UIPreferences {
  /** Preferred theme (future: light mode support) */
  theme: 'dark' | 'light' | 'system'
  /** Whether to show line numbers in editor */
  showLineNumbers: boolean
  /** Whether to word wrap in editor */
  wordWrap: boolean
  /** Font size for editor */
  editorFontSize: number
  /** Whether to auto-compile on save */
  autoCompile: boolean
}

/** Export preferences */
export interface ExportPreferences {
  /** Default export directory */
  exportDirectory?: string
  /** Whether to auto-open exported files */
  autoOpen: boolean
  /** Default export format */
  defaultFormat: 'pptx' | 'pdf'
}

interface SettingsState {
  // Provider config
  currentProvider: AIProviderConfig | null
  apiKeys: ApiKeys

  // Preferences
  uiPreferences: UIPreferences
  exportPreferences: ExportPreferences

  // Loading state
  isLoading: boolean
  isSaving: boolean

  // Error state
  error: string | null

  // Actions
  setCurrentProvider: (provider: AIProviderConfig | null) => void
  setApiKey: (provider: AIProviderType, key: string) => void
  removeApiKey: (provider: AIProviderType) => void
  setUIPreference: <K extends keyof UIPreferences>(key: K, value: UIPreferences[K]) => void
  setExportPreference: <K extends keyof ExportPreferences>(
    key: K,
    value: ExportPreferences[K]
  ) => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setError: (error: string | null) => void

  // Load settings from main process
  loadSettings: () => Promise<void>

  // Switch provider (updates main process)
  switchProvider: (type: AIProviderType, modelId?: string) => Promise<boolean>

  // Check if a provider has a valid API key
  hasApiKey: (provider: AIProviderType) => boolean

  // Get all configured providers
  getConfiguredProviders: () => AIProviderType[]
}

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------

const DEFAULT_UI_PREFERENCES: UIPreferences = {
  theme: 'dark',
  showLineNumbers: true,
  wordWrap: true,
  editorFontSize: 13,
  autoCompile: true
}

const DEFAULT_EXPORT_PREFERENCES: ExportPreferences = {
  autoOpen: true,
  defaultFormat: 'pptx'
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Initial state
  currentProvider: null,
  apiKeys: {},
  uiPreferences: DEFAULT_UI_PREFERENCES,
  exportPreferences: DEFAULT_EXPORT_PREFERENCES,
  isLoading: true,
  isSaving: false,
  error: null,

  // Basic setters
  setCurrentProvider: (currentProvider) => set({ currentProvider }),
  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),
  setError: (error) => set({ error }),

  // Set API key for a provider
  setApiKey: (provider, key) =>
    set((state) => ({
      apiKeys: { ...state.apiKeys, [provider]: key }
    })),

  // Remove API key for a provider
  removeApiKey: (provider) =>
    set((state) => {
      const newKeys = { ...state.apiKeys }
      delete newKeys[provider]
      return { apiKeys: newKeys }
    }),

  // Set UI preference
  setUIPreference: (key, value) =>
    set((state) => ({
      uiPreferences: { ...state.uiPreferences, [key]: value }
    })),

  // Set export preference
  setExportPreference: (key, value) =>
    set((state) => ({
      exportPreferences: { ...state.exportPreferences, [key]: value }
    })),

  // Load settings from main process
  loadSettings: async () => {
    try {
      set({ isLoading: true })

      // Load current provider
      const { config } = await window.api.getProvider()
      if (config) {
        set({
          currentProvider: config,
          apiKeys: { [config.type]: config.apiKey }
        })
      }

      set({ isLoading: false })
    } catch (error) {
      console.error('Failed to load settings:', error)
      set({ isLoading: false, error: 'Failed to load settings' })
    }
  },

  // Switch provider
  switchProvider: async (type, modelId) => {
    const state = get()
    const apiKey = state.apiKeys[type]

    if (!apiKey) {
      set({ error: `No API key configured for ${type}` })
      return false
    }

    // Import DEFAULT_MODELS dynamically to avoid circular deps
    const defaultModels: Record<AIProviderType, string> = {
      openrouter: 'anthropic/claude-sonnet-4-20250514',
      anthropic: 'claude-sonnet-4-20250514',
      openai: 'gpt-4o'
    }

    const config: AIProviderConfig = {
      type,
      apiKey,
      modelId: modelId || defaultModels[type]
    }

    try {
      set({ isSaving: true, error: null })
      await window.api.setProvider(config)
      set({ currentProvider: config, isSaving: false })
      return true
    } catch (error) {
      console.error('Failed to switch provider:', error)
      set({ isSaving: false, error: 'Failed to switch provider' })
      return false
    }
  },

  // Check if a provider has a valid API key
  hasApiKey: (provider) => {
    const key = get().apiKeys[provider]
    return !!key && key.length > 0
  },

  // Get all configured providers
  getConfiguredProviders: () => {
    const { apiKeys } = get()
    return (Object.keys(apiKeys) as AIProviderType[]).filter(
      (p) => apiKeys[p] && apiKeys[p]!.length > 0
    )
  }
}))
