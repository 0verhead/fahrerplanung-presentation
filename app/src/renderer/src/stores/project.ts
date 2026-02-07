/**
 * Project Store — Manages project/session state with Zustand
 *
 * Handles:
 * - Current project metadata
 * - Project dirty state (unsaved changes)
 * - Recent projects list
 * - Save/load operations (via IPC when implemented)
 *
 * Note: The actual save/load IPC handlers will be implemented
 * in the "Project/session management" task.
 */

import { create } from 'zustand'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Project metadata */
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
}

/** Recent project entry */
export interface RecentProject {
  id: string
  name: string
  path: string
  lastOpened: string
}

interface ProjectState {
  // Current project
  currentProject: ProjectMetadata | null
  isProjectDirty: boolean

  // Recent projects
  recentProjects: RecentProject[]

  // Loading state
  isLoading: boolean
  isSaving: boolean

  // Error state
  error: string | null

  // Actions
  setCurrentProject: (project: ProjectMetadata | null) => void
  setProjectDirty: (dirty: boolean) => void
  setRecentProjects: (projects: RecentProject[]) => void
  addRecentProject: (project: RecentProject) => void
  removeRecentProject: (id: string) => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setError: (error: string | null) => void

  // Create new project
  createNewProject: (name?: string) => void

  // Update project name
  updateProjectName: (name: string) => void

  // Mark project as modified
  markDirty: () => void

  // Clear project
  clearProject: () => void
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function generateProjectId(): string {
  return `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  currentProject: null,
  isProjectDirty: false,
  recentProjects: [],
  isLoading: false,
  isSaving: false,
  error: null,

  // Basic setters
  setCurrentProject: (currentProject) => set({ currentProject }),
  setProjectDirty: (isProjectDirty) => set({ isProjectDirty }),
  setRecentProjects: (recentProjects) => set({ recentProjects }),
  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),
  setError: (error) => set({ error }),

  // Add recent project (prevents duplicates)
  addRecentProject: (project) =>
    set((state) => ({
      recentProjects: [project, ...state.recentProjects.filter((p) => p.id !== project.id)].slice(
        0,
        10
      ) // Keep only last 10 recent projects
    })),

  // Remove recent project
  removeRecentProject: (id) =>
    set((state) => ({
      recentProjects: state.recentProjects.filter((p) => p.id !== id)
    })),

  // Create new project
  createNewProject: (name) => {
    const now = new Date().toISOString()
    const project: ProjectMetadata = {
      id: generateProjectId(),
      name: name || 'Untitled Presentation',
      createdAt: now,
      updatedAt: now
    }
    set({
      currentProject: project,
      isProjectDirty: false,
      error: null
    })
  },

  // Update project name
  updateProjectName: (name) => {
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
  },

  // Mark project as modified
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

  // Clear project
  clearProject: () =>
    set({
      currentProject: null,
      isProjectDirty: false,
      error: null
    })
}))
