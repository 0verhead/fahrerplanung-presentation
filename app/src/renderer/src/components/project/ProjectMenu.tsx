/**
 * ProjectMenu — Dropdown menu for project management operations.
 *
 * Provides access to:
 * - New project
 * - Save project (Cmd+S)
 * - Save as new file
 * - Open recent projects
 * - Close project
 *
 * Uses Zustand for project state via useProjectStore.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useProjectStore } from '../../stores'
import type { RecentProject } from '../../../../shared/types/ai'

/**
 * ProjectMenu — Dropdown menu for project operations.
 * Displayed in the title bar or top of the chat panel.
 */
export function ProjectMenu(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Project state
  const currentProject = useProjectStore((s) => s.currentProject)
  const isProjectDirty = useProjectStore((s) => s.isProjectDirty)
  const recentProjects = useProjectStore((s) => s.recentProjects)
  const isSaving = useProjectStore((s) => s.isSaving)
  const isLoading = useProjectStore((s) => s.isLoading)

  // Actions
  const createNewProject = useProjectStore((s) => s.createNewProject)
  const saveProject = useProjectStore((s) => s.saveProject)
  const loadProject = useProjectStore((s) => s.loadProject)
  const loadRecentProjects = useProjectStore((s) => s.loadRecentProjects)
  const closeProject = useProjectStore((s) => s.closeProject)
  const initialize = useProjectStore((s) => s.initialize)

  // Define handlers first (before useEffects that use them)
  const handleNewProject = useCallback(async () => {
    setIsOpen(false)
    await createNewProject()
  }, [createNewProject])

  const handleSave = useCallback(async () => {
    setIsOpen(false)
    await saveProject()
  }, [saveProject])

  const handleSaveAs = useCallback(async () => {
    setIsOpen(false)
    await saveProject(true)
  }, [saveProject])

  // Initialize on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  // Reload recent projects when menu opens
  useEffect(() => {
    if (isOpen) {
      loadRecentProjects()
    }
  }, [isOpen, loadRecentProjects])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (currentProject && !isSaving) {
          handleSave()
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        handleNewProject()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentProject, isSaving, handleSave, handleNewProject])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleLoadRecent = useCallback(
    async (project: RecentProject) => {
      setIsOpen(false)
      await loadProject({ path: project.path, projectId: project.id })
    },
    [loadProject]
  )

  const handleCloseProject = useCallback(async () => {
    setIsOpen(false)
    await closeProject()
  }, [closeProject])

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Menu trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary"
      >
        {/* Folder icon */}
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>

        {/* Project name or "No Project" */}
        <span className="max-w-[180px] truncate font-medium">
          {currentProject ? currentProject.name : 'No Project'}
        </span>

        {/* Dirty indicator */}
        {isProjectDirty && <span className="text-accent">&#8226;</span>}

        {/* Chevron */}
        <svg
          className={`h-3 w-3 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-border bg-surface-elevated py-1 shadow-lg shadow-black/20">
          {/* New project */}
          <button
            onClick={handleNewProject}
            disabled={isLoading}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Presentation
            </span>
            <kbd className="rounded bg-surface-ground px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary">
              &#8984;N
            </kbd>
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-border" />

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!currentProject || isSaving}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
              {isSaving ? 'Saving...' : 'Save'}
            </span>
            <kbd className="rounded bg-surface-ground px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary">
              &#8984;S
            </kbd>
          </button>

          {/* Save As */}
          <button
            onClick={handleSaveAs}
            disabled={!currentProject || isSaving}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                <path d="M2 12.5v5.5h16v-5.5h-2v3.5H4v-3.5H2z" />
              </svg>
              Save As...
            </span>
          </button>

          {/* Divider */}
          {recentProjects.length > 0 && <div className="my-1 border-t border-border" />}

          {/* Recent projects */}
          {recentProjects.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                Recent
              </div>
              <div className="max-h-48 overflow-y-auto">
                {recentProjects.slice(0, 5).map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleLoadRecent(project)}
                    disabled={isLoading || currentProject?.id === project.id}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary disabled:opacity-50"
                  >
                    <span className="truncate">{project.name}</span>
                    <span className="ml-2 flex-shrink-0 text-xs text-text-tertiary">
                      {formatDate(project.lastOpened)}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Close project */}
          {currentProject && (
            <>
              <div className="my-1 border-t border-border" />
              <button
                onClick={handleCloseProject}
                disabled={isLoading}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Close Project
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
