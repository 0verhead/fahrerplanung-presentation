/**
 * Zustand stores barrel export
 *
 * All stores are exported here for convenient imports:
 *   import { useConversationStore, useEditorStore } from '@renderer/stores'
 */

// Conversation store — chat messages, streaming, tool calls
export { useConversationStore } from './conversation'
export type { ActiveToolCall, StepProgress } from './conversation'

// Editor store — TSX code, dirty flag, pending changes
export { useEditorStore } from './editor'
export type { PendingChange } from './editor'

// Project store — save/load, project metadata
export { useProjectStore, startAutoSave, stopAutoSave } from './project'
export type { ProjectMetadata } from './project'

// Settings store — API keys, model, preferences
export { useSettingsStore } from './settings'
export type { ApiKeys, UIPreferences, ExportPreferences } from './settings'
