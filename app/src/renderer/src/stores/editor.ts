/**
 * Editor Store — Manages code editor state with Zustand
 *
 * Handles:
 * - Current TSX source code
 * - Dirty flag (unsaved changes)
 * - Pending AI changes (for diff view)
 * - Loading state
 *
 * Syncs with main process via IPC for code persistence.
 */

import { create } from 'zustand'
import type { TsxChangedEvent } from '../../../shared/types/ai'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Pending AI change for diff view */
export interface PendingChange {
  newCode: string
  previousCode: string
}

interface EditorState {
  // Code state
  code: string
  isLoading: boolean
  isDirty: boolean

  // Pending AI change (for diff view)
  pendingChange: PendingChange | null

  // Actions
  setCode: (code: string) => void
  setLoading: (loading: boolean) => void
  setDirty: (dirty: boolean) => void

  // Pending change actions
  setPendingChange: (change: PendingChange | null) => void
  acceptChange: () => void
  rejectChange: () => void

  // Handle TSX changed event from main process
  handleTsxChanged: (event: TsxChangedEvent) => void

  // Load initial code from main process
  loadCode: () => Promise<void>

  // Save code to main process (debounced externally)
  saveCode: (code: string) => Promise<void>

  // Update code locally (from editor changes)
  updateCode: (code: string) => void
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  code: '',
  isLoading: true,
  isDirty: false,
  pendingChange: null,

  // Basic setters
  setCode: (code) => set({ code }),
  setLoading: (isLoading) => set({ isLoading }),
  setDirty: (isDirty) => set({ isDirty }),

  // Pending change actions
  setPendingChange: (pendingChange) => set({ pendingChange }),

  acceptChange: () => {
    const { pendingChange } = get()
    if (pendingChange) {
      set({
        code: pendingChange.newCode,
        pendingChange: null,
        isDirty: false
      })
    }
  },

  rejectChange: () => {
    set({ pendingChange: null })
  },

  // Handle TSX changed event from main process
  handleTsxChanged: (event) => {
    if (event.source === 'ai' && event.previousCode !== undefined) {
      // Show diff view for AI changes
      set({
        pendingChange: {
          newCode: event.code,
          previousCode: event.previousCode
        }
      })
    } else {
      // Direct update (initial load or non-diff update)
      set({
        code: event.code,
        isDirty: false
      })
    }
  },

  // Load initial code from main process
  loadCode: async () => {
    try {
      const { code } = await window.api.getTsx()
      set({ code, isLoading: false })
    } catch (error) {
      console.error('Failed to load TSX code:', error)
      set({ isLoading: false })
    }
  },

  // Save code to main process
  saveCode: async (code) => {
    try {
      await window.api.setTsx(code)
      set({ isDirty: false })
    } catch (error) {
      console.error('Failed to save TSX code:', error)
    }
  },

  // Update code locally (marks as dirty, doesn't save immediately)
  updateCode: (code) => {
    set({ code, isDirty: true })
  }
}))
