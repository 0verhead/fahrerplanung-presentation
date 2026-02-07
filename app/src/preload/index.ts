import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { AI_IPC_CHANNELS } from '../shared/types/ai'
import type {
  AIProviderConfig,
  AIStreamEvent,
  ChatMessage,
  SendMessagePayload,
  SetProviderPayload
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
