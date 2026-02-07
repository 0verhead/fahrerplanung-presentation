import { ElectronAPI } from '@electron-toolkit/preload'
import type {
  AIProviderConfig,
  AIProviderType,
  AIStreamEvent,
  ChatMessage,
  TsxChangedEvent,
  SlidePreviewState,
  SlidesUpdatedEvent,
  GetBrandKitsResponse,
  ExportPptxResponse,
  ExportPdfResponse,
  GetAllSettingsResponse,
  UIPreferences,
  ExportPreferences,
  ProjectData,
  GetCurrentProjectResponse,
  SaveProjectResponse,
  LoadProjectResponse,
  ListRecentProjectsResponse,
  ProjectChangedEvent
} from '../shared/types/ai'

/** AI API exposed from the preload script */
interface EncoreAIApi {
  // Chat & AI
  sendMessage(message: string, providerConfig?: AIProviderConfig): void
  onStreamEvent(callback: (event: AIStreamEvent) => void): () => void
  abort(): void
  setProvider(config: AIProviderConfig): Promise<{ success: boolean }>
  getProvider(): Promise<{ config: AIProviderConfig | null }>
  clearHistory(): Promise<{ success: boolean }>
  getHistory(): Promise<{ messages: ChatMessage[] }>

  // Code editor
  getTsx(): Promise<{ code: string }>
  setTsx(code: string): Promise<{ success: boolean }>
  onTsxChanged(callback: (event: TsxChangedEvent) => void): () => void

  // Slide preview
  getSlides(): Promise<SlidePreviewState>
  onSlidesUpdated(callback: (event: SlidesUpdatedEvent) => void): () => void
  triggerCompile(): Promise<{ success: boolean; error?: string }>

  // Brand kit
  getBrandKits(): Promise<GetBrandKitsResponse>
  getBrandKit(): Promise<{ brandKitId: string }>
  setBrandKit(brandKitId: string): Promise<{ success: boolean }>
  getThemeVariant(): Promise<{ variant: 'dark' | 'light' }>
  setThemeVariant(variant: 'dark' | 'light'): Promise<{ success: boolean }>

  // Export
  exportPptx(
    sourcePath: string,
    suggestedName?: string,
    autoOpen?: boolean
  ): Promise<ExportPptxResponse>
  exportPdf(
    sourcePath: string,
    suggestedName?: string,
    autoOpen?: boolean
  ): Promise<ExportPdfResponse>
  openPptx(filePath: string): Promise<{ success: boolean; error?: string }>
  revealInFinder(filePath: string): void
  isPdfExportAvailable(): Promise<{ available: boolean }>

  // Settings
  getSettings(): Promise<GetAllSettingsResponse>
  setApiKey(provider: AIProviderType, apiKey: string): Promise<{ success: boolean }>
  removeApiKey(provider: AIProviderType): Promise<{ success: boolean }>
  setPreferredModel(provider: AIProviderType, modelId: string): Promise<{ success: boolean }>
  setUIPreference<K extends keyof UIPreferences>(
    key: K,
    value: UIPreferences[K]
  ): Promise<{ success: boolean }>
  setExportPreference<K extends keyof ExportPreferences>(
    key: K,
    value: ExportPreferences[K]
  ): Promise<{ success: boolean }>

  // Project management
  getProject(): Promise<GetCurrentProjectResponse>
  createProject(name?: string): Promise<{ success: boolean; project?: ProjectData }>
  saveProject(forceNewPath?: boolean): Promise<SaveProjectResponse>
  loadProject(options: { path?: string; projectId?: string }): Promise<LoadProjectResponse>
  listRecentProjects(): Promise<ListRecentProjectsResponse>
  deleteProject(projectId: string): Promise<{ success: boolean }>
  closeProject(): Promise<{ success: boolean }>
  updateProjectMetadata(updates: {
    name?: string
    description?: string
  }): Promise<{ success: boolean }>
  onProjectChanged(callback: (event: ProjectChangedEvent) => void): () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: EncoreAIApi
  }
}
