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
  abortGeneration,
  setBrandKit,
  getCurrentBrandKitId,
  setThemeVariant,
  getCurrentThemeVariant
} from './ai-service'
import { clearProviderCache } from './ai-provider-registry'
import { getCurrentTsx, setTsx, onTsxChange } from './tool-handlers'
import {
  getSlidePreviewState,
  onSlidePreviewStateChange,
  startCompilation,
  finishCompilation
} from './slide-preview-state'
import { compileTsx } from './compiler'
import { AI_IPC_CHANNELS } from '../shared/types/ai'
import type {
  SendMessagePayload,
  SetProviderPayload,
  SetBrandKitPayload,
  SetThemeVariantPayload,
  TsxChangedEvent,
  SlidesUpdatedEvent
} from '../shared/types/ai'
import { getAllBrandKitMeta } from '../shared/brand'

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

  // --- Get current slide preview state ---
  ipcMain.handle(AI_IPC_CHANNELS.GET_SLIDES, async () => {
    return getSlidePreviewState()
  })

  // --- Trigger manual compilation ---
  ipcMain.handle(AI_IPC_CHANNELS.TRIGGER_COMPILE, async () => {
    const tsxSource = getCurrentTsx().trim()
    if (!tsxSource) {
      return { success: false, error: 'No presentation code to compile' }
    }

    // Notify renderer that compilation is starting
    startCompilation()

    try {
      const result = await compileTsx({
        source: tsxSource,
        generateThumbnails: true
      })

      // Convert thumbnails to the format expected by slide-preview-state
      const slides =
        result.thumbnails?.map((t) => ({
          slideIndex: t.slideNumber - 1, // Convert 1-based to 0-based
          dataUri: t.dataUri,
          width: t.width,
          height: t.height
        })) || []

      // Update slide preview state
      finishCompilation({
        success: result.success,
        slideCount: result.slideCount,
        slides,
        error: result.error,
        warnings: result.warnings,
        pptxPath: result.outputPath
      })

      return result
    } catch (err) {
      const error = `Compilation failed: ${err instanceof Error ? err.message : String(err)}`
      finishCompilation({
        success: false,
        slideCount: 0,
        slides: [],
        error
      })
      return { success: false, error }
    }
  })

  // --- Register callback to forward slide preview updates to renderer ---
  onSlidePreviewStateChange((state) => {
    const win = getMainWindow()
    if (win && !win.isDestroyed()) {
      const event: SlidesUpdatedEvent = { state }
      win.webContents.send(AI_IPC_CHANNELS.SLIDES_UPDATED, event)
    }
  })

  // --- Get available brand kits ---
  ipcMain.handle(AI_IPC_CHANNELS.GET_BRAND_KITS, async () => {
    return {
      kits: getAllBrandKitMeta(),
      activeId: getCurrentBrandKitId(),
      activeTheme: getCurrentThemeVariant()
    }
  })

  // --- Get current brand kit ID ---
  ipcMain.handle(AI_IPC_CHANNELS.GET_BRAND_KIT, async () => {
    return { brandKitId: getCurrentBrandKitId() }
  })

  // --- Set active brand kit ---
  ipcMain.handle(AI_IPC_CHANNELS.SET_BRAND_KIT, async (_event, payload: SetBrandKitPayload) => {
    setBrandKit(payload.brandKitId)
    return { success: true }
  })

  // --- Get current theme variant ---
  ipcMain.handle(AI_IPC_CHANNELS.GET_THEME_VARIANT, async () => {
    return { variant: getCurrentThemeVariant() }
  })

  // --- Set theme variant ---
  ipcMain.handle(
    AI_IPC_CHANNELS.SET_THEME_VARIANT,
    async (_event, payload: SetThemeVariantPayload) => {
      setThemeVariant(payload.variant)
      return { success: true }
    }
  )
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
  ipcMain.removeHandler(AI_IPC_CHANNELS.GET_SLIDES)
  ipcMain.removeHandler(AI_IPC_CHANNELS.TRIGGER_COMPILE)
  ipcMain.removeHandler(AI_IPC_CHANNELS.GET_BRAND_KITS)
  ipcMain.removeHandler(AI_IPC_CHANNELS.GET_BRAND_KIT)
  ipcMain.removeHandler(AI_IPC_CHANNELS.SET_BRAND_KIT)
  ipcMain.removeHandler(AI_IPC_CHANNELS.GET_THEME_VARIANT)
  ipcMain.removeHandler(AI_IPC_CHANNELS.SET_THEME_VARIANT)
}
