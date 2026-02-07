/**
 * Project Service — Session management for Encore presentations
 *
 * Manages project lifecycle:
 * - Create new projects
 * - Save projects (conversation history, TSX source, metadata)
 * - Load projects
 * - List recent projects
 * - Delete projects
 * - Auto-save on changes
 *
 * Projects are stored in the user's app data directory.
 */

import { app } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'
import type { ChatMessage } from '../shared/types/ai'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Project metadata stored with the project */
export interface ProjectMetadata {
  /** Unique project ID */
  id: string
  /** User-defined project name */
  name: string
  /** Optional description */
  description?: string
  /** Creation timestamp (ISO) */
  createdAt: string
  /** Last modified timestamp (ISO) */
  updatedAt: string
  /** Version number for compatibility */
  version: number
}

/** Full project data structure */
export interface ProjectData {
  /** Project metadata */
  metadata: ProjectMetadata
  /** Conversation history (ChatMessage format for portability) */
  conversation: ChatMessage[]
  /** Current TSX source code */
  tsxSource: string
  /** Path to the last compiled PPTX (relative to project) */
  lastPptxPath?: string
}

/** Saved project file structure */
interface SavedProject {
  version: number
  data: ProjectData
}

/** Recent project entry for quick access */
export interface RecentProject {
  id: string
  name: string
  path: string
  lastOpened: string
  description?: string
}

/** Projects list stored in settings */
interface ProjectsIndex {
  recentProjects: RecentProject[]
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Current project file format version */
const PROJECT_VERSION = 1

/** Maximum number of recent projects to track */
const MAX_RECENT_PROJECTS = 20

/** Projects directory name under userData */
const PROJECTS_DIR = 'projects'

/** Projects index file name */
const PROJECTS_INDEX_FILE = 'projects-index.json'

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

/** Currently loaded project */
let currentProject: ProjectData | null = null

/** Path to the current project file */
let currentProjectPath: string | null = null

/** Flag indicating unsaved changes */
let isDirty = false

/** Callback for dirty state changes */
let onDirtyChange: ((dirty: boolean) => void) | null = null

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Get the projects directory path
 */
function getProjectsDir(): string {
  return path.join(app.getPath('userData'), PROJECTS_DIR)
}

/**
 * Get the projects index file path
 */
function getProjectsIndexPath(): string {
  return path.join(app.getPath('userData'), PROJECTS_INDEX_FILE)
}

/**
 * Ensure the projects directory exists
 */
async function ensureProjectsDir(): Promise<void> {
  const dir = getProjectsDir()
  await fs.mkdir(dir, { recursive: true })
}

/**
 * Generate a unique project ID
 */
function generateProjectId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `proj_${timestamp}_${random}`
}

/**
 * Generate a safe filename from a project name
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}

/**
 * Load the projects index
 */
async function loadProjectsIndex(): Promise<ProjectsIndex> {
  const indexPath = getProjectsIndexPath()
  try {
    const data = await fs.readFile(indexPath, 'utf-8')
    return JSON.parse(data) as ProjectsIndex
  } catch {
    return { recentProjects: [] }
  }
}

/**
 * Save the projects index
 */
async function saveProjectsIndex(index: ProjectsIndex): Promise<void> {
  const indexPath = getProjectsIndexPath()
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8')
}

/**
 * Add or update a project in the recent projects list
 */
async function updateRecentProjects(project: ProjectMetadata, projectPath: string): Promise<void> {
  const index = await loadProjectsIndex()

  // Remove existing entry if present
  index.recentProjects = index.recentProjects.filter((p) => p.id !== project.id)

  // Add to the front
  index.recentProjects.unshift({
    id: project.id,
    name: project.name,
    path: projectPath,
    lastOpened: new Date().toISOString(),
    description: project.description
  })

  // Trim to max size
  index.recentProjects = index.recentProjects.slice(0, MAX_RECENT_PROJECTS)

  await saveProjectsIndex(index)
}

/**
 * Remove a project from the recent projects list
 */
async function removeFromRecentProjects(projectId: string): Promise<void> {
  const index = await loadProjectsIndex()
  index.recentProjects = index.recentProjects.filter((p) => p.id !== projectId)
  await saveProjectsIndex(index)
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create a new project
 */
export function createProject(name?: string): ProjectData {
  const now = new Date().toISOString()
  const id = generateProjectId()

  const project: ProjectData = {
    metadata: {
      id,
      name: name || 'Untitled Presentation',
      createdAt: now,
      updatedAt: now,
      version: PROJECT_VERSION
    },
    conversation: [],
    tsxSource: ''
  }

  currentProject = project
  currentProjectPath = null
  isDirty = true
  onDirtyChange?.(isDirty)

  return project
}

/**
 * Get the current project
 */
export function getCurrentProject(): ProjectData | null {
  return currentProject
}

/**
 * Get the current project path
 */
export function getCurrentProjectPath(): string | null {
  return currentProjectPath
}

/**
 * Check if the current project has unsaved changes
 */
export function isProjectDirty(): boolean {
  return isDirty
}

/**
 * Set the dirty state change callback
 */
export function setOnDirtyChange(callback: ((dirty: boolean) => void) | null): void {
  onDirtyChange = callback
}

/**
 * Mark the current project as dirty (has unsaved changes)
 */
export function markDirty(): void {
  if (currentProject && !isDirty) {
    isDirty = true
    currentProject.metadata.updatedAt = new Date().toISOString()
    onDirtyChange?.(isDirty)
  }
}

/**
 * Update the current project's metadata
 */
export function updateProjectMetadata(
  updates: Partial<Pick<ProjectMetadata, 'name' | 'description'>>
): void {
  if (currentProject) {
    if (updates.name !== undefined) {
      currentProject.metadata.name = updates.name
    }
    if (updates.description !== undefined) {
      currentProject.metadata.description = updates.description
    }
    markDirty()
  }
}

/**
 * Update the current project's conversation history
 */
export function updateConversation(conversation: ChatMessage[]): void {
  if (currentProject) {
    currentProject.conversation = conversation
    markDirty()
  }
}

/**
 * Update the current project's TSX source
 */
export function updateTsxSource(tsx: string): void {
  if (currentProject) {
    currentProject.tsxSource = tsx
    markDirty()
  }
}

/**
 * Update the current project's last PPTX path
 */
export function updateLastPptxPath(pptxPath: string): void {
  if (currentProject) {
    currentProject.lastPptxPath = pptxPath
    markDirty()
  }
}

/**
 * Save the current project
 *
 * @param forceNewPath - If true, always prompt for a new save location
 * @returns The path where the project was saved, or null if cancelled/failed
 */
export async function saveProject(forceNewPath = false): Promise<string | null> {
  if (!currentProject) {
    return null
  }

  await ensureProjectsDir()

  // Determine the save path
  let savePath = currentProjectPath

  if (!savePath || forceNewPath) {
    // Generate a new path
    const filename = sanitizeFilename(currentProject.metadata.name) || 'untitled'
    const timestamp = Date.now()
    savePath = path.join(getProjectsDir(), `${filename}-${timestamp}.encore`)
  }

  // Update the timestamp
  currentProject.metadata.updatedAt = new Date().toISOString()

  // Prepare the save data
  const saveData: SavedProject = {
    version: PROJECT_VERSION,
    data: currentProject
  }

  // Write to file
  try {
    await fs.writeFile(savePath, JSON.stringify(saveData, null, 2), 'utf-8')
    currentProjectPath = savePath
    isDirty = false
    onDirtyChange?.(isDirty)

    // Update recent projects
    await updateRecentProjects(currentProject.metadata, savePath)

    return savePath
  } catch (error) {
    console.error('Failed to save project:', error)
    return null
  }
}

/**
 * Load a project from a file path
 *
 * @param projectPath - Path to the .encore project file
 * @returns The loaded project data, or null if failed
 */
export async function loadProject(projectPath: string): Promise<ProjectData | null> {
  try {
    const data = await fs.readFile(projectPath, 'utf-8')
    const saved: SavedProject = JSON.parse(data)

    // Version compatibility check
    if (saved.version > PROJECT_VERSION) {
      console.warn(
        `Project was saved with version ${saved.version}, current is ${PROJECT_VERSION}. ` +
          'Some features may not work correctly.'
      )
    }

    currentProject = saved.data
    currentProjectPath = projectPath
    isDirty = false
    onDirtyChange?.(isDirty)

    // Update recent projects
    await updateRecentProjects(saved.data.metadata, projectPath)

    return saved.data
  } catch (error) {
    console.error('Failed to load project:', error)
    return null
  }
}

/**
 * Load a project by ID (looks up the path in recent projects)
 *
 * @param projectId - The project ID
 * @returns The loaded project data, or null if failed
 */
export async function loadProjectById(projectId: string): Promise<ProjectData | null> {
  const index = await loadProjectsIndex()
  const recent = index.recentProjects.find((p) => p.id === projectId)

  if (!recent) {
    console.error(`Project ${projectId} not found in recent projects`)
    return null
  }

  return loadProject(recent.path)
}

/**
 * Get the list of recent projects
 */
export async function getRecentProjects(): Promise<RecentProject[]> {
  const index = await loadProjectsIndex()

  // Validate that project files still exist
  const validProjects: RecentProject[] = []
  for (const project of index.recentProjects) {
    try {
      await fs.access(project.path)
      validProjects.push(project)
    } catch {
      // Project file no longer exists, skip it
    }
  }

  // Update index if some projects were removed
  if (validProjects.length !== index.recentProjects.length) {
    index.recentProjects = validProjects
    await saveProjectsIndex(index)
  }

  return validProjects
}

/**
 * Delete a project by ID
 *
 * @param projectId - The project ID to delete
 * @returns True if successful
 */
export async function deleteProject(projectId: string): Promise<boolean> {
  const index = await loadProjectsIndex()
  const project = index.recentProjects.find((p) => p.id === projectId)

  if (!project) {
    return false
  }

  try {
    // Delete the project file
    await fs.unlink(project.path)
  } catch (error) {
    // File might already be deleted, continue anyway
    console.warn('Could not delete project file:', error)
  }

  // Remove from recent projects
  await removeFromRecentProjects(projectId)

  // If this was the current project, clear it
  if (currentProject?.metadata.id === projectId) {
    currentProject = null
    currentProjectPath = null
    isDirty = false
    onDirtyChange?.(isDirty)
  }

  return true
}

/**
 * Close the current project without saving
 */
export function closeProject(): void {
  currentProject = null
  currentProjectPath = null
  isDirty = false
  onDirtyChange?.(isDirty)
}

/**
 * Check if a project exists at the given path
 */
export async function projectExists(projectPath: string): Promise<boolean> {
  try {
    await fs.access(projectPath)
    return true
  } catch {
    return false
  }
}

/**
 * Export the current project data for IPC
 */
export function exportProjectForIpc(): {
  project: ProjectData | null
  path: string | null
  isDirty: boolean
} {
  return {
    project: currentProject,
    path: currentProjectPath,
    isDirty
  }
}
