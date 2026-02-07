/**
 * IPC Handlers — Bridge between renderer and AI service
 *
 * Registers all AI-related IPC handlers on the main process.
 * The renderer communicates through the preload-exposed API,
 * which maps to these handlers via Electron's ipcMain.
 */

import { ipcMain, type BrowserWindow } from 'electron'

import {
  streamChat,
  setProviderConfig,
  getProviderConfig,
  clearHistory,
  getHistory,
  abortGeneration
} from './ai-service'
import { clearProviderCache } from './ai-provider-registry'
import { getCurrentTsx, setTsx, onTsxChange } from './tool-handlers'
import { AI_IPC_CHANNELS } from '../shared/types/ai'
import type { SendMessagePayload, SetProviderPayload, TsxChangedEvent } from '../shared/types/ai'

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

/**
 * Register all AI IPC handlers. Call once during app initialization.
 *
 * @param getMainWindow - Function that returns the current BrowserWindow
 *   (needed to send stream events back to the renderer).
 */
export function registerAIIpcHandlers(getMainWindow: () => BrowserWindow | null): void {
  // --- Send message & stream response ---
  ipcMain.on(AI_IPC_CHANNELS.SEND_MESSAGE, async (_event, payload: SendMessagePayload) => {
    const win = getMainWindow()
    if (!win) return

    await streamChat(payload.message, payload.providerConfig, (streamEvent) => {
      // Forward each stream event to the renderer
      if (!win.isDestroyed()) {
        win.webContents.send(AI_IPC_CHANNELS.STREAM_EVENT, streamEvent)
      }
    })
  })

  // --- Abort current generation ---
  ipcMain.on(AI_IPC_CHANNELS.ABORT, () => {
    abortGeneration()
  })

  // --- Set provider config ---
  ipcMain.handle(AI_IPC_CHANNELS.SET_PROVIDER, async (_event, payload: SetProviderPayload) => {
    // Clear cached providers when config changes
    clearProviderCache()
    setProviderConfig(payload.config)
    return { success: true }
  })

  // --- Get provider config ---
  ipcMain.handle(AI_IPC_CHANNELS.GET_PROVIDER, async () => {
    const config = getProviderConfig()
    return { config }
  })

  // --- Clear conversation history ---
  ipcMain.handle(AI_IPC_CHANNELS.CLEAR_HISTORY, async () => {
    clearHistory()
    return { success: true }
  })

  // --- Get conversation history ---
  ipcMain.handle(AI_IPC_CHANNELS.GET_HISTORY, async () => {
    return { messages: getHistory() }
  })

  // --- Get current TSX source ---
  ipcMain.handle(AI_IPC_CHANNELS.GET_TSX, async () => {
    return { code: getCurrentTsx() }
  })

  // --- Set TSX source (from user edits) ---
  ipcMain.handle(AI_IPC_CHANNELS.SET_TSX, async (_event, payload: { code: string }) => {
    setTsx(payload.code)
    return { success: true }
  })

  // --- Register callback to forward TSX changes from AI to renderer ---
  onTsxChange((code, previousCode) => {
    const win = getMainWindow()
    if (win && !win.isDestroyed()) {
      const event: TsxChangedEvent = {
        code,
        source: 'ai',
        previousCode
      }
      win.webContents.send(AI_IPC_CHANNELS.TSX_CHANGED, event)
    }
  })
}

/**
 * Remove all AI IPC handlers. Call during cleanup/shutdown.
 */
export function removeAIIpcHandlers(): void {
  ipcMain.removeAllListeners(AI_IPC_CHANNELS.SEND_MESSAGE)
  ipcMain.removeAllListeners(AI_IPC_CHANNELS.ABORT)
  ipcMain.removeHandler(AI_IPC_CHANNELS.SET_PROVIDER)
  ipcMain.removeHandler(AI_IPC_CHANNELS.GET_PROVIDER)
  ipcMain.removeHandler(AI_IPC_CHANNELS.CLEAR_HISTORY)
  ipcMain.removeHandler(AI_IPC_CHANNELS.GET_HISTORY)
  ipcMain.removeHandler(AI_IPC_CHANNELS.GET_TSX)
  ipcMain.removeHandler(AI_IPC_CHANNELS.SET_TSX)
}
