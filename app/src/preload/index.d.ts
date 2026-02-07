import { ElectronAPI } from '@electron-toolkit/preload'
import type { AIProviderConfig, AIStreamEvent, ChatMessage } from '../shared/types/ai'

/** AI API exposed from the preload script */
interface EncoreAIApi {
  sendMessage(message: string, providerConfig?: AIProviderConfig): void
  onStreamEvent(callback: (event: AIStreamEvent) => void): () => void
  abort(): void
  setProvider(config: AIProviderConfig): Promise<{ success: boolean }>
  getProvider(): Promise<{ config: AIProviderConfig | null }>
  clearHistory(): Promise<{ success: boolean }>
  getHistory(): Promise<{ messages: ChatMessage[] }>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: EncoreAIApi
  }
}
