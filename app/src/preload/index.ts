import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { AI_IPC_CHANNELS } from '../shared/types/ai'
import type {
  AIProviderConfig,
  AIProviderType,
  AIStreamEvent,
  ChatMessage,
  SendMessagePayload,
  SetProviderPayload,
  SetBrandKitPayload,
  SetThemeVariantPayload,
  TsxChangedEvent,
  SlidePreviewState,
  SlidesUpdatedEvent,
  GetBrandKitsResponse,
  ExportPptxPayload,
  ExportPptxResponse,
  ExportPdfPayload,
  ExportPdfResponse,
  OpenPptxPayload,
  RevealInFinderPayload,
  GetAllSettingsResponse,
  SetApiKeyPayload,
  RemoveApiKeyPayload,
  SetPreferredModelPayload,
  SetUIPreferencePayload,
  SetExportPreferencePayload,
  UIPreferences,
  ExportPreferences
} from '../shared/types/ai'

// ---------------------------------------------------------------------------
// AI API exposed to renderer
// ---------------------------------------------------------------------------

const aiApi = {
  /**
   * Send a user message and begin streaming a response.
   * Listen for stream events via `onStreamEvent`.
   */
  sendMessage(message: string, providerConfig?: AIProviderConfig): void {
    const payload: SendMessagePayload = { message, providerConfig }
    ipcRenderer.send(AI_IPC_CHANNELS.SEND_MESSAGE, payload)
  },

  /**
   * Register a callback for AI stream events.
   * Returns an unsubscribe function.
   */
  onStreamEvent(callback: (event: AIStreamEvent) => void): () => void {
    const handler = (_event: Electron.IpcRendererEvent, streamEvent: AIStreamEvent): void => {
      callback(streamEvent)
    }
    ipcRenderer.on(AI_IPC_CHANNELS.STREAM_EVENT, handler)
    return () => {
      ipcRenderer.removeListener(AI_IPC_CHANNELS.STREAM_EVENT, handler)
    }
  },

  /**
   * Abort the current AI generation.
   */
  abort(): void {
    ipcRenderer.send(AI_IPC_CHANNELS.ABORT)
  },

  /**
   * Set the AI provider configuration.
   */
  async setProvider(config: AIProviderConfig): Promise<{ success: boolean }> {
    const payload: SetProviderPayload = { config }
    return ipcRenderer.invoke(AI_IPC_CHANNELS.SET_PROVIDER, payload)
  },

  /**
   * Get the current AI provider configuration.
   */
  async getProvider(): Promise<{ config: AIProviderConfig | null }> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.GET_PROVIDER)
  },

  /**
   * Clear the conversation history.
   */
  async clearHistory(): Promise<{ success: boolean }> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.CLEAR_HISTORY)
  },

  /**
   * Get the conversation history.
   */
  async getHistory(): Promise<{ messages: ChatMessage[] }> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.GET_HISTORY)
  },

  /**
   * Get the current TSX source code.
   */
  async getTsx(): Promise<{ code: string }> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.GET_TSX)
  },

  /**
   * Set the TSX source code (from user edits).
   */
  async setTsx(code: string): Promise<{ success: boolean }> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.SET_TSX, { code })
  },

  /**
   * Register a callback for TSX code changes (from AI or other sources).
   * Returns an unsubscribe function.
   */
  onTsxChanged(callback: (event: TsxChangedEvent) => void): () => void {
    const handler = (_event: Electron.IpcRendererEvent, tsxEvent: TsxChangedEvent): void => {
      callback(tsxEvent)
    }
    ipcRenderer.on(AI_IPC_CHANNELS.TSX_CHANGED, handler)
    return () => {
      ipcRenderer.removeListener(AI_IPC_CHANNELS.TSX_CHANGED, handler)
    }
  },

  /**
   * Get the current slide preview state.
   */
  async getSlides(): Promise<SlidePreviewState> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.GET_SLIDES)
  },

  /**
   * Register a callback for slide preview updates.
   * Returns an unsubscribe function.
   */
  onSlidesUpdated(callback: (event: SlidesUpdatedEvent) => void): () => void {
    const handler = (_event: Electron.IpcRendererEvent, slidesEvent: SlidesUpdatedEvent): void => {
      callback(slidesEvent)
    }
    ipcRenderer.on(AI_IPC_CHANNELS.SLIDES_UPDATED, handler)
    return () => {
      ipcRenderer.removeListener(AI_IPC_CHANNELS.SLIDES_UPDATED, handler)
    }
  },

  /**
   * Trigger a manual compilation.
   */
  async triggerCompile(): Promise<{ success: boolean; error?: string }> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.TRIGGER_COMPILE)
  },

  // ---------------------------------------------------------------------------
  // Brand Kit API
  // ---------------------------------------------------------------------------

  /**
   * Get all available brand kits.
   */
  async getBrandKits(): Promise<GetBrandKitsResponse> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.GET_BRAND_KITS)
  },

  /**
   * Get the current brand kit ID.
   */
  async getBrandKit(): Promise<{ brandKitId: string }> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.GET_BRAND_KIT)
  },

  /**
   * Set the active brand kit.
   */
  async setBrandKit(brandKitId: string): Promise<{ success: boolean }> {
    const payload: SetBrandKitPayload = { brandKitId }
    return ipcRenderer.invoke(AI_IPC_CHANNELS.SET_BRAND_KIT, payload)
  },

  /**
   * Get the current theme variant.
   */
  async getThemeVariant(): Promise<{ variant: 'dark' | 'light' }> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.GET_THEME_VARIANT)
  },

  /**
   * Set the theme variant.
   */
  async setThemeVariant(variant: 'dark' | 'light'): Promise<{ success: boolean }> {
    const payload: SetThemeVariantPayload = { variant }
    return ipcRenderer.invoke(AI_IPC_CHANNELS.SET_THEME_VARIANT, payload)
  },

  // ---------------------------------------------------------------------------
  // Export API
  // ---------------------------------------------------------------------------

  /**
   * Export PPTX to a user-selected location.
   * Shows a native save dialog and optionally opens the file.
   */
  async exportPptx(
    sourcePath: string,
    suggestedName?: string,
    autoOpen?: boolean
  ): Promise<ExportPptxResponse> {
    const payload: ExportPptxPayload = { sourcePath, suggestedName, autoOpen }
    return ipcRenderer.invoke(AI_IPC_CHANNELS.EXPORT_PPTX, payload)
  },

  /**
   * Export as PDF to a user-selected location.
   * Requires LibreOffice to be installed.
   */
  async exportPdf(
    sourcePath: string,
    suggestedName?: string,
    autoOpen?: boolean
  ): Promise<ExportPdfResponse> {
    const payload: ExportPdfPayload = { sourcePath, suggestedName, autoOpen }
    return ipcRenderer.invoke(AI_IPC_CHANNELS.EXPORT_PDF, payload)
  },

  /**
   * Open a PPTX file with the system default application.
   */
  async openPptx(filePath: string): Promise<{ success: boolean; error?: string }> {
    const payload: OpenPptxPayload = { filePath }
    return ipcRenderer.invoke(AI_IPC_CHANNELS.OPEN_PPTX, payload)
  },

  /**
   * Reveal a file in the system file explorer.
   */
  revealInFinder(filePath: string): void {
    const payload: RevealInFinderPayload = { filePath }
    ipcRenderer.send(AI_IPC_CHANNELS.REVEAL_IN_FINDER, payload)
  },

  /**
   * Check if PDF export is available (requires LibreOffice).
   */
  async isPdfExportAvailable(): Promise<{ available: boolean }> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.IS_PDF_EXPORT_AVAILABLE)
  },

  // ---------------------------------------------------------------------------
  // Settings API
  // ---------------------------------------------------------------------------

  /**
   * Get all settings.
   */
  async getSettings(): Promise<GetAllSettingsResponse> {
    return ipcRenderer.invoke(AI_IPC_CHANNELS.GET_SETTINGS)
  },

  /**
   * Set API key for a provider.
   */
  async setApiKey(provider: AIProviderType, apiKey: string): Promise<{ success: boolean }> {
    const payload: SetApiKeyPayload = { provider, apiKey }
    return ipcRenderer.invoke(AI_IPC_CHANNELS.SET_API_KEY, payload)
  },

  /**
   * Remove API key for a provider.
   */
  async removeApiKey(provider: AIProviderType): Promise<{ success: boolean }> {
    const payload: RemoveApiKeyPayload = { provider }
    return ipcRenderer.invoke(AI_IPC_CHANNELS.REMOVE_API_KEY, payload)
  },

  /**
   * Set preferred model for a provider.
   */
  async setPreferredModel(
    provider: AIProviderType,
    modelId: string
  ): Promise<{ success: boolean }> {
    const payload: SetPreferredModelPayload = { provider, modelId }
    return ipcRenderer.invoke(AI_IPC_CHANNELS.SET_PREFERRED_MODEL, payload)
  },

  /**
   * Set a UI preference.
   */
  async setUIPreference<K extends keyof UIPreferences>(
    key: K,
    value: UIPreferences[K]
  ): Promise<{ success: boolean }> {
    const payload: SetUIPreferencePayload = { key, value }
    return ipcRenderer.invoke(AI_IPC_CHANNELS.SET_UI_PREFERENCE, payload)
  },

  /**
   * Set an export preference.
   */
  async setExportPreference<K extends keyof ExportPreferences>(
    key: K,
    value: ExportPreferences[K]
  ): Promise<{ success: boolean }> {
    const payload: SetExportPreferencePayload = { key, value }
    return ipcRenderer.invoke(AI_IPC_CHANNELS.SET_EXPORT_PREFERENCE, payload)
  }
}

// ---------------------------------------------------------------------------
// Expose APIs to renderer
// ---------------------------------------------------------------------------

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', aiApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = aiApi
}
