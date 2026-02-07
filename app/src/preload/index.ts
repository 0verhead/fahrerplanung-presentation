import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { AI_IPC_CHANNELS } from '../shared/types/ai'
import type {
  AIProviderConfig,
  AIStreamEvent,
  ChatMessage,
  SendMessagePayload,
  SetProviderPayload,
  SetBrandKitPayload,
  SetThemeVariantPayload,
  TsxChangedEvent,
  SlidePreviewState,
  SlidesUpdatedEvent,
  GetBrandKitsResponse
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
