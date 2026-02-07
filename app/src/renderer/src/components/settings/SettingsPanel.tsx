/**
 * SettingsPanel — Settings modal/panel for Encore
 *
 * Provides UI for:
 * - API key management (OpenRouter, Anthropic, OpenAI)
 * - Model selection per provider
 * - Brand kit and theme selection
 * - Export preferences
 * - UI preferences
 *
 * Follows the app design system with modal styling.
 */

import { useState, useEffect, useCallback } from 'react'
import type {
  AIProviderType,
  GetAllSettingsResponse,
  UIPreferences,
  ExportPreferences,
  BrandKitMeta
} from '../../../../shared/types/ai'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROVIDER_INFO: Record<
  AIProviderType,
  { name: string; description: string; placeholder: string; models: string[] }
> = {
  openrouter: {
    name: 'OpenRouter',
    description: 'Access multiple models (Claude, GPT-4, etc.) through a single API',
    placeholder: 'sk-or-...',
    models: [
      'anthropic/claude-sonnet-4-20250514',
      'anthropic/claude-opus-4-20250514',
      'openai/gpt-4o',
      'openai/gpt-4o-mini',
      'google/gemini-2.0-flash-exp',
      'meta-llama/llama-3.3-70b-instruct'
    ]
  },
  anthropic: {
    name: 'Anthropic',
    description: 'Direct access to Claude models',
    placeholder: 'sk-ant-...',
    models: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-3-5-haiku-20241022']
  },
  openai: {
    name: 'OpenAI',
    description: 'Direct access to GPT models',
    placeholder: 'sk-...',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o1', 'o1-mini']
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps): React.JSX.Element | null {
  // Settings state
  const [settings, setSettings] = useState<GetAllSettingsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'providers' | 'appearance' | 'export'>('providers')
  const [brandKits, setBrandKits] = useState<BrandKitMeta[]>([])

  // Form state for API keys (unsaved)
  const [apiKeyInputs, setApiKeyInputs] = useState<Record<AIProviderType, string>>({
    openrouter: '',
    anthropic: '',
    openai: ''
  })
  const [showKeys, setShowKeys] = useState<Record<AIProviderType, boolean>>({
    openrouter: false,
    anthropic: false,
    openai: false
  })
  const [savingKey, setSavingKey] = useState<AIProviderType | null>(null)
  const [activeProvider, setActiveProvider] = useState<AIProviderType | null>(null)

  // Load settings on mount
  useEffect(() => {
    if (!isOpen) return

    const loadSettings = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const [settingsRes, brandKitsRes] = await Promise.all([
          window.api.getSettings(),
          window.api.getBrandKits()
        ])
        setSettings(settingsRes)
        setBrandKits(brandKitsRes.kits)

        // Initialize API key inputs with masked values
        setApiKeyInputs({
          openrouter: settingsRes.apiKeys.openrouter ? '••••••••••••••••' : '',
          anthropic: settingsRes.apiKeys.anthropic ? '••••••••••••••••' : '',
          openai: settingsRes.apiKeys.openai ? '••••••••••••••••' : ''
        })

        // Set active provider
        setActiveProvider(settingsRes.currentProvider?.type ?? null)
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [isOpen])

  // Handle API key change
  const handleApiKeyChange = useCallback((provider: AIProviderType, value: string) => {
    setApiKeyInputs((prev) => ({ ...prev, [provider]: value }))
  }, [])

  // Save API key
  const handleSaveApiKey = useCallback(
    async (provider: AIProviderType) => {
      const key = apiKeyInputs[provider]
      if (!key || key === '••••••••••••••••') return

      try {
        setSavingKey(provider)
        await window.api.setApiKey(provider, key)

        // Reload settings
        const newSettings = await window.api.getSettings()
        setSettings(newSettings)

        // Update input to masked value
        setApiKeyInputs((prev) => ({ ...prev, [provider]: '••••••••••••••••' }))
        setShowKeys((prev) => ({ ...prev, [provider]: false }))
      } catch (err) {
        console.error('Failed to save API key:', err)
      } finally {
        setSavingKey(null)
      }
    },
    [apiKeyInputs]
  )

  // Remove API key
  const handleRemoveApiKey = useCallback(async (provider: AIProviderType) => {
    try {
      setSavingKey(provider)
      await window.api.removeApiKey(provider)

      // Reload settings
      const newSettings = await window.api.getSettings()
      setSettings(newSettings)

      // Clear input
      setApiKeyInputs((prev) => ({ ...prev, [provider]: '' }))
    } catch (err) {
      console.error('Failed to remove API key:', err)
    } finally {
      setSavingKey(null)
    }
  }, [])

  // Activate provider
  const handleActivateProvider = useCallback(
    async (provider: AIProviderType) => {
      if (!settings) return

      const apiKey = settings.apiKeys[provider]
      if (!apiKey) return

      try {
        const modelId = settings.modelPreferences[provider]
        await window.api.setProvider({ type: provider, apiKey, modelId })

        // Reload settings
        const newSettings = await window.api.getSettings()
        setSettings(newSettings)
        setActiveProvider(provider)
      } catch (err) {
        console.error('Failed to activate provider:', err)
      }
    },
    [settings]
  )

  // Change model for a provider
  const handleModelChange = useCallback(async (provider: AIProviderType, modelId: string) => {
    try {
      await window.api.setPreferredModel(provider, modelId)

      // Reload settings
      const newSettings = await window.api.getSettings()
      setSettings(newSettings)
    } catch (err) {
      console.error('Failed to change model:', err)
    }
  }, [])

  // Handle UI preference change
  const handleUIPreferenceChange = useCallback(
    async <K extends keyof UIPreferences>(key: K, value: UIPreferences[K]) => {
      try {
        await window.api.setUIPreference(key, value)
        const newSettings = await window.api.getSettings()
        setSettings(newSettings)
      } catch (err) {
        console.error('Failed to update UI preference:', err)
      }
    },
    []
  )

  // Handle export preference change
  const handleExportPreferenceChange = useCallback(
    async <K extends keyof ExportPreferences>(key: K, value: ExportPreferences[K]) => {
      try {
        await window.api.setExportPreference(key, value)
        const newSettings = await window.api.getSettings()
        setSettings(newSettings)
      } catch (err) {
        console.error('Failed to update export preference:', err)
      }
    },
    []
  )

  // Handle brand kit change
  const handleBrandKitChange = useCallback(async (brandKitId: string) => {
    try {
      await window.api.setBrandKit(brandKitId)
      const newSettings = await window.api.getSettings()
      setSettings(newSettings)
    } catch (err) {
      console.error('Failed to change brand kit:', err)
    }
  }, [])

  // Handle theme variant change
  const handleThemeVariantChange = useCallback(async (variant: 'dark' | 'light') => {
    try {
      await window.api.setThemeVariant(variant)
      const newSettings = await window.api.getSettings()
      setSettings(newSettings)
    } catch (err) {
      console.error('Failed to change theme variant:', err)
    }
  }, [])

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="animate-scale-in relative flex h-[600px] w-[720px] flex-col overflow-hidden rounded-xl border border-border bg-surface-base shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-text-primary">Settings</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-overlay hover:text-text-secondary"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Sidebar */}
          <div className="flex w-48 flex-shrink-0 flex-col border-r border-border bg-surface-ground py-2">
            <button
              onClick={() => setActiveTab('providers')}
              className={`flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                activeTab === 'providers'
                  ? 'bg-accent-dim/50 text-accent-bright'
                  : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              <span>API Keys</span>
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                activeTab === 'appearance'
                  ? 'bg-accent-dim/50 text-accent-bright'
                  : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              <span>Appearance</span>
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                activeTab === 'export'
                  ? 'bg-accent-dim/50 text-accent-bright'
                  : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span>Export</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-default border-t-transparent" />
              </div>
            ) : activeTab === 'providers' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-text-primary">AI Providers</h3>
                  <p className="text-xs text-text-tertiary">
                    Configure your API keys to enable AI features. Your keys are stored locally.
                  </p>
                </div>

                {/* Provider cards */}
                <div className="space-y-4">
                  {(Object.keys(PROVIDER_INFO) as AIProviderType[]).map((provider) => {
                    const info = PROVIDER_INFO[provider]
                    const hasKey = !!settings?.apiKeys[provider]
                    const isActive = activeProvider === provider

                    return (
                      <div
                        key={provider}
                        className={`rounded-lg border p-4 transition-colors ${
                          isActive
                            ? 'border-accent-default/50 bg-accent-dim/20'
                            : 'border-border bg-surface-raised'
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-primary">{info.name}</span>
                            {isActive && (
                              <span className="rounded-full bg-accent-default/20 px-2 py-0.5 text-[10px] font-medium text-accent-bright">
                                Active
                              </span>
                            )}
                          </div>
                          {hasKey && !isActive && (
                            <button
                              onClick={() => handleActivateProvider(provider)}
                              className="rounded-md bg-surface-overlay px-3 py-1 text-xs text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                        <p className="mb-3 text-xs text-text-tertiary">{info.description}</p>

                        {/* API Key input */}
                        <div className="space-y-2">
                          <label className="text-xs text-text-secondary">API Key</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type={showKeys[provider] ? 'text' : 'password'}
                                value={apiKeyInputs[provider]}
                                onChange={(e) => handleApiKeyChange(provider, e.target.value)}
                                placeholder={info.placeholder}
                                className="w-full rounded-md border border-border bg-surface-ground px-3 py-2 font-mono text-sm text-text-primary placeholder-text-disabled focus:border-accent-default focus:outline-none focus:ring-1 focus:ring-accent-default/50"
                              />
                              <button
                                onClick={() =>
                                  setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }))
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                              >
                                {showKeys[provider] ? (
                                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                      fillRule="evenodd"
                                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                      clipRule="evenodd"
                                    />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            {apiKeyInputs[provider] &&
                            apiKeyInputs[provider] !== '••••••••••••••••' ? (
                              <button
                                onClick={() => handleSaveApiKey(provider)}
                                disabled={savingKey === provider}
                                className="rounded-md bg-accent-default px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-accent-bright disabled:opacity-50"
                              >
                                {savingKey === provider ? 'Saving...' : 'Save'}
                              </button>
                            ) : hasKey ? (
                              <button
                                onClick={() => handleRemoveApiKey(provider)}
                                disabled={savingKey === provider}
                                className="rounded-md border border-error/30 bg-error-dim px-4 py-2 text-sm text-error transition-colors hover:bg-error/20 disabled:opacity-50"
                              >
                                Remove
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {/* Model selector */}
                        {hasKey && (
                          <div className="mt-3 space-y-2">
                            <label className="text-xs text-text-secondary">Model</label>
                            <select
                              value={settings?.modelPreferences[provider] || info.models[0]}
                              onChange={(e) => handleModelChange(provider, e.target.value)}
                              className="w-full appearance-none rounded-md border border-border bg-surface-ground px-3 py-2 pr-8 text-sm text-text-primary focus:border-accent-default focus:outline-none focus:ring-1 focus:ring-accent-default/50"
                            >
                              {info.models.map((model) => (
                                <option key={model} value={model}>
                                  {model}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : activeTab === 'appearance' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-text-primary">Appearance</h3>
                  <p className="text-xs text-text-tertiary">
                    Customize the look and feel of Encore and generated presentations.
                  </p>
                </div>

                {/* Brand Kit */}
                <div className="space-y-3">
                  <label className="text-xs font-medium text-text-secondary">
                    Presentation Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {brandKits.map((kit) => (
                      <button
                        key={kit.id}
                        onClick={() => handleBrandKitChange(kit.id)}
                        className={`rounded-lg border p-3 text-left transition-colors ${
                          settings?.brandPreferences.activeBrandKitId === kit.id
                            ? 'border-accent-default bg-accent-dim/30'
                            : 'border-border bg-surface-raised hover:border-border-strong'
                        }`}
                      >
                        <div className="font-medium text-text-primary">{kit.name}</div>
                        {kit.description && (
                          <div className="mt-0.5 text-xs text-text-tertiary">{kit.description}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Variant */}
                <div className="space-y-3">
                  <label className="text-xs font-medium text-text-secondary">Theme Variant</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleThemeVariantChange('dark')}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                        settings?.brandPreferences.activeThemeVariant === 'dark'
                          ? 'border-accent-default bg-accent-dim/30'
                          : 'border-border bg-surface-raised hover:border-border-strong'
                      }`}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                      <span className="text-sm text-text-primary">Dark</span>
                    </button>
                    <button
                      onClick={() => handleThemeVariantChange('light')}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                        settings?.brandPreferences.activeThemeVariant === 'light'
                          ? 'border-accent-default bg-accent-dim/30'
                          : 'border-border bg-surface-raised hover:border-border-strong'
                      }`}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-text-primary">Light</span>
                    </button>
                  </div>
                </div>

                {/* Editor preferences */}
                <div className="space-y-3">
                  <label className="text-xs font-medium text-text-secondary">
                    Editor Preferences
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between rounded-lg border border-border bg-surface-raised p-3">
                      <span className="text-sm text-text-primary">Show line numbers</span>
                      <input
                        type="checkbox"
                        checked={settings?.uiPreferences.showLineNumbers ?? true}
                        onChange={(e) =>
                          handleUIPreferenceChange('showLineNumbers', e.target.checked)
                        }
                        className="h-4 w-4 rounded border-border text-accent-default focus:ring-accent-default"
                      />
                    </label>
                    <label className="flex items-center justify-between rounded-lg border border-border bg-surface-raised p-3">
                      <span className="text-sm text-text-primary">Word wrap</span>
                      <input
                        type="checkbox"
                        checked={settings?.uiPreferences.wordWrap ?? true}
                        onChange={(e) => handleUIPreferenceChange('wordWrap', e.target.checked)}
                        className="h-4 w-4 rounded border-border text-accent-default focus:ring-accent-default"
                      />
                    </label>
                    <label className="flex items-center justify-between rounded-lg border border-border bg-surface-raised p-3">
                      <span className="text-sm text-text-primary">Auto-compile on save</span>
                      <input
                        type="checkbox"
                        checked={settings?.uiPreferences.autoCompile ?? true}
                        onChange={(e) => handleUIPreferenceChange('autoCompile', e.target.checked)}
                        className="h-4 w-4 rounded border-border text-accent-default focus:ring-accent-default"
                      />
                    </label>
                    <div className="flex items-center justify-between rounded-lg border border-border bg-surface-raised p-3">
                      <span className="text-sm text-text-primary">Editor font size</span>
                      <select
                        value={settings?.uiPreferences.editorFontSize ?? 13}
                        onChange={(e) =>
                          handleUIPreferenceChange('editorFontSize', parseInt(e.target.value))
                        }
                        className="rounded-md border border-border bg-surface-ground px-2 py-1 text-sm text-text-primary focus:border-accent-default focus:outline-none"
                      >
                        <option value={11}>11px</option>
                        <option value={12}>12px</option>
                        <option value={13}>13px</option>
                        <option value={14}>14px</option>
                        <option value={16}>16px</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-text-primary">Export Settings</h3>
                  <p className="text-xs text-text-tertiary">
                    Configure how presentations are exported.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between rounded-lg border border-border bg-surface-raised p-3">
                    <div>
                      <span className="text-sm text-text-primary">Auto-open after export</span>
                      <p className="mt-0.5 text-xs text-text-tertiary">
                        Open the file in your default app after exporting
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings?.exportPreferences.autoOpen ?? true}
                      onChange={(e) => handleExportPreferenceChange('autoOpen', e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent-default focus:ring-accent-default"
                    />
                  </label>

                  <div className="rounded-lg border border-border bg-surface-raised p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-text-primary">Default format</span>
                        <p className="mt-0.5 text-xs text-text-tertiary">
                          Preferred format for quick exports
                        </p>
                      </div>
                      <select
                        value={settings?.exportPreferences.defaultFormat ?? 'pptx'}
                        onChange={(e) =>
                          handleExportPreferenceChange(
                            'defaultFormat',
                            e.target.value as 'pptx' | 'pdf'
                          )
                        }
                        className="rounded-md border border-border bg-surface-ground px-2 py-1 text-sm text-text-primary focus:border-accent-default focus:outline-none"
                      >
                        <option value="pptx">PowerPoint (.pptx)</option>
                        <option value="pdf">PDF (.pdf)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
