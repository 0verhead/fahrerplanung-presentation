/**
 * Project Store — Manages project/session state with Zustand
 *
 * Handles:
 * - Current project metadata
 * - Project dirty state (unsaved changes)
 * - Recent projects list
 * - Save/load operations via IPC
 * - Auto-save functionality
 *
 * Integrates with the main process project-service via window.api methods.
 */

import { create } from 'zustand'
import type { ProjectData, RecentProject, ProjectChangedEvent } from '../../../shared/types/ai'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Project metadata for renderer display */
export interface ProjectMetadata {
  /** Unique project ID */
  id: string
  /** User-defined project name */
  name: string
  /** Path to the project file (if saved) */
  path?: string
  /** Creation timestamp (ISO) */
  createdAt: string
  /** Last modified timestamp (ISO) */
  updatedAt: string
  /** Optional description */
  description?: string
  /** Version number */
  version: number
}

interface ProjectState {
  // Current project
  currentProject: ProjectMetadata | null
  isProjectDirty: boolean
  projectPath: string | null

  // Recent projects
  recentProjects: RecentProject[]

  // Loading state
  isLoading: boolean
  isSaving: boolean

  // Error state
  error: string | null

  // Auto-save state
  autoSaveEnabled: boolean
  autoSaveInterval: number // milliseconds
  lastAutoSave: string | null

  // Actions - Basic setters
  setCurrentProject: (project: ProjectMetadata | null) => void
  setProjectDirty: (dirty: boolean) => void
  setProjectPath: (path: string | null) => void
  setRecentProjects: (projects: RecentProject[]) => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setError: (error: string | null) => void
  setAutoSaveEnabled: (enabled: boolean) => void

  // Actions - IPC-backed operations
  initialize: () => Promise<void>
  createNewProject: (name?: string) => Promise<void>
  saveProject: (forceNewPath?: boolean) => Promise<boolean>
  loadProject: (options: { path?: string; projectId?: string }) => Promise<boolean>
  loadRecentProjects: () => Promise<void>
  deleteProject: (projectId: string) => Promise<boolean>
  closeProject: () => Promise<void>
  updateProjectName: (name: string) => Promise<void>
  updateProjectDescription: (description: string) => Promise<void>

  // Actions - Handle project changes from main process
  handleProjectChanged: (event: ProjectChangedEvent) => void

  // Actions - Mark dirty
  markDirty: () => void

  // Actions - Clear error
  clearError: () => void
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function projectDataToMetadata(data: ProjectData, path: string | null): ProjectMetadata {
  return {
    id: data.metadata.id,
    name: data.metadata.name,
    path: path || undefined,
    createdAt: data.metadata.createdAt,
    updatedAt: data.metadata.updatedAt,
    description: data.metadata.description,
    version: data.metadata.version
  }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  currentProject: null,
  isProjectDirty: false,
  projectPath: null,
  recentProjects: [],
  isLoading: false,
  isSaving: false,
  error: null,
  autoSaveEnabled: true,
  autoSaveInterval: 60000, // 1 minute
  lastAutoSave: null,

  // Basic setters
  setCurrentProject: (currentProject) => set({ currentProject }),
  setProjectDirty: (isProjectDirty) => set({ isProjectDirty }),
  setProjectPath: (projectPath) => set({ projectPath }),
  setRecentProjects: (recentProjects) => set({ recentProjects }),
  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),
  setError: (error) => set({ error }),
  setAutoSaveEnabled: (autoSaveEnabled) => set({ autoSaveEnabled }),

  // Initialize store from main process
  initialize: async () => {
    try {
      set({ isLoading: true, error: null })

      // Get current project state from main process
      const projectState = await window.api.getProject()
      if (projectState.project) {
        set({
          currentProject: projectDataToMetadata(projectState.project, projectState.path),
          projectPath: projectState.path,
          isProjectDirty: projectState.isDirty
        })
      }

      // Load recent projects
      const recentResponse = await window.api.listRecentProjects()
      set({ recentProjects: recentResponse.projects })

      // Subscribe to project changes
      window.api.onProjectChanged((event) => {
        get().handleProjectChanged(event)
      })
    } catch (err) {
      set({ error: `Failed to initialize project state: ${err}` })
    } finally {
      set({ isLoading: false })
    }
  },

  // Create a new project
  createNewProject: async (name) => {
    try {
      set({ isLoading: true, error: null })

      const response = await window.api.createProject(name)
      if (response.success && response.project) {
        set({
          currentProject: projectDataToMetadata(response.project, null),
          projectPath: null,
          isProjectDirty: true
        })
      } else {
        set({ error: 'Failed to create project' })
      }
    } catch (err) {
      set({ error: `Failed to create project: ${err}` })
    } finally {
      set({ isLoading: false })
    }
  },

  // Save the current project
  saveProject: async (forceNewPath = false) => {
    try {
      set({ isSaving: true, error: null })

      const response = await window.api.saveProject(forceNewPath)
      if (response.success && response.path) {
        const { currentProject } = get()
        if (currentProject) {
          set({
            currentProject: { ...currentProject, path: response.path },
            projectPath: response.path,
            isProjectDirty: false,
            lastAutoSave: new Date().toISOString()
          })
        }
        // Reload recent projects to include this one
        await get().loadRecentProjects()
        return true
      } else {
        set({ error: response.error || 'Failed to save project' })
        return false
      }
    } catch (err) {
      set({ error: `Failed to save project: ${err}` })
      return false
    } finally {
      set({ isSaving: false })
    }
  },

  // Load a project
  loadProject: async (options) => {
    try {
      set({ isLoading: true, error: null })

      const response = await window.api.loadProject(options)
      if (response.success && response.project) {
        // The project path is returned in the response or can be determined from options
        const path = options.path || null
        set({
          currentProject: projectDataToMetadata(response.project, path),
          projectPath: path,
          isProjectDirty: false
        })
        // Reload recent projects to update order
        await get().loadRecentProjects()
        return true
      } else {
        set({ error: response.error || 'Failed to load project' })
        return false
      }
    } catch (err) {
      set({ error: `Failed to load project: ${err}` })
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  // Load recent projects list
  loadRecentProjects: async () => {
    try {
      const response = await window.api.listRecentProjects()
      set({ recentProjects: response.projects })
    } catch (err) {
      console.error('Failed to load recent projects:', err)
    }
  },

  // Delete a project
  deleteProject: async (projectId) => {
    try {
      const response = await window.api.deleteProject(projectId)
      if (response.success) {
        // If this was the current project, clear it
        const { currentProject } = get()
        if (currentProject?.id === projectId) {
          set({
            currentProject: null,
            projectPath: null,
            isProjectDirty: false
          })
        }
        // Reload recent projects
        await get().loadRecentProjects()
        return true
      }
      return false
    } catch (err) {
      set({ error: `Failed to delete project: ${err}` })
      return false
    }
  },

  // Close current project
  closeProject: async () => {
    try {
      await window.api.closeProject()
      set({
        currentProject: null,
        projectPath: null,
        isProjectDirty: false,
        error: null
      })
    } catch (err) {
      set({ error: `Failed to close project: ${err}` })
    }
  },

  // Update project name
  updateProjectName: async (name) => {
    try {
      await window.api.updateProjectMetadata({ name })
      const { currentProject } = get()
      if (currentProject) {
        set({
          currentProject: {
            ...currentProject,
            name,
            updatedAt: new Date().toISOString()
          },
          isProjectDirty: true
        })
      }
    } catch (err) {
      set({ error: `Failed to update project name: ${err}` })
    }
  },

  // Update project description
  updateProjectDescription: async (description) => {
    try {
      await window.api.updateProjectMetadata({ description })
      const { currentProject } = get()
      if (currentProject) {
        set({
          currentProject: {
            ...currentProject,
            description,
            updatedAt: new Date().toISOString()
          },
          isProjectDirty: true
        })
      }
    } catch (err) {
      set({ error: `Failed to update project description: ${err}` })
    }
  },

  // Handle project changes from main process
  handleProjectChanged: (event) => {
    if (event.project) {
      set({
        currentProject: projectDataToMetadata(event.project, event.path),
        projectPath: event.path,
        isProjectDirty: event.isDirty
      })
    } else {
      set({
        currentProject: null,
        projectPath: null,
        isProjectDirty: false
      })
    }
  },

  // Mark current project as dirty
  markDirty: () => {
    const { currentProject } = get()
    if (currentProject) {
      set({
        currentProject: {
          ...currentProject,
          updatedAt: new Date().toISOString()
        },
        isProjectDirty: true
      })
    }
  },

  // Clear error state
  clearError: () => set({ error: null })
}))

// ---------------------------------------------------------------------------
// Auto-save hook
// ---------------------------------------------------------------------------

let autoSaveIntervalId: ReturnType<typeof setInterval> | null = null

/**
 * Start auto-save for the current project.
 * Should be called when the app mounts.
 */
export function startAutoSave(): void {
  if (autoSaveIntervalId) {
    return // Already running
  }

  autoSaveIntervalId = setInterval(async () => {
    const state = useProjectStore.getState()

    // Only auto-save if enabled, dirty, and has a project
    if (state.autoSaveEnabled && state.isProjectDirty && state.currentProject && !state.isSaving) {
      console.log('[AutoSave] Saving project...')
      await state.saveProject()
    }
  }, useProjectStore.getState().autoSaveInterval)
}

/**
 * Stop auto-save.
 * Should be called when the app unmounts.
 */
export function stopAutoSave(): void {
  if (autoSaveIntervalId) {
    clearInterval(autoSaveIntervalId)
    autoSaveIntervalId = null
  }
}
