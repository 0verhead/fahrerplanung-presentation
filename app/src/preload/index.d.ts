import { ElectronAPI } from '@electron-toolkit/preload'
import type {
  AIProviderConfig,
  AIStreamEvent,
  ChatMessage,
  TsxChangedEvent,
  SlidePreviewState,
  SlidesUpdatedEvent
} from '../shared/types/ai'

/** AI API exposed from the preload script */
interface EncoreAIApi {
  sendMessage(message: string, providerConfig?: AIProviderConfig): void
  onStreamEvent(callback: (event: AIStreamEvent) => void): () => void
  abort(): void
  setProvider(config: AIProviderConfig): Promise<{ success: boolean }>
  getProvider(): Promise<{ config: AIProviderConfig | null }>
  clearHistory(): Promise<{ success: boolean }>
  getHistory(): Promise<{ messages: ChatMessage[] }>
  getTsx(): Promise<{ code: string }>
  setTsx(code: string): Promise<{ success: boolean }>
  onTsxChanged(callback: (event: TsxChangedEvent) => void): () => void
  getSlides(): Promise<SlidePreviewState>
  onSlidesUpdated(callback: (event: SlidesUpdatedEvent) => void): () => void
  triggerCompile(): Promise<{ success: boolean; error?: string }>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: EncoreAIApi
  }
}
