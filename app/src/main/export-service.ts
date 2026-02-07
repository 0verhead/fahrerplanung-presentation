/**
 * Export Service — Handles PPTX file export operations
 *
 * Features:
 * - Save PPTX to user-selected location via Electron dialog
 * - Auto-open exported file with system default application
 * - Optional PDF export via LibreOffice headless (when available)
 */

import { dialog, shell, app } from 'electron'
import { readFile, copyFile, access, mkdir } from 'node:fs/promises'
import { dirname, basename, extname, join } from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExportOptions {
  /** Path to the source PPTX file */
  sourcePath: string
  /** Suggested filename (without path) */
  suggestedName?: string
  /** Whether to auto-open the file after export */
  autoOpen?: boolean
}

export interface ExportResult {
  success: boolean
  /** Path where the file was saved */
  exportedPath?: string
  /** Error message if failed */
  error?: string
  /** Whether the file was opened */
  opened?: boolean
}

export interface PdfExportOptions {
  /** Path to the source PPTX file */
  sourcePath: string
  /** Suggested filename (without path) */
  suggestedName?: string
  /** Whether to auto-open the PDF after export */
  autoOpen?: boolean
}

export interface PdfExportResult {
  success: boolean
  exportedPath?: string
  error?: string
  opened?: boolean
}

// ---------------------------------------------------------------------------
// PPTX Export
// ---------------------------------------------------------------------------

/**
 * Export a PPTX file to a user-selected location.
 * Shows a native save dialog and copies the file.
 *
 * @param options - Export options including source path and filename
 * @returns Result with success status and exported path
 */
export async function exportPptx(options: ExportOptions): Promise<ExportResult> {
  const { sourcePath, suggestedName, autoOpen = true } = options

  // Verify source file exists
  try {
    await access(sourcePath)
  } catch {
    return {
      success: false,
      error: `Source file not found: ${sourcePath}`
    }
  }

  // Generate suggested filename if not provided
  const defaultName = suggestedName || generateDefaultFilename(sourcePath)

  // Show native save dialog
  const result = await dialog.showSaveDialog({
    title: 'Export Presentation',
    defaultPath: join(app.getPath('documents'), defaultName),
    filters: [
      { name: 'PowerPoint Presentation', extensions: ['pptx'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['createDirectory', 'showOverwriteConfirmation']
  })

  // User cancelled
  if (result.canceled || !result.filePath) {
    return {
      success: false,
      error: 'Export cancelled by user'
    }
  }

  const targetPath = result.filePath

  // Ensure target directory exists
  try {
    await mkdir(dirname(targetPath), { recursive: true })
  } catch {
    // Directory may already exist, continue
  }

  // Copy the file
  try {
    await copyFile(sourcePath, targetPath)
  } catch (err) {
    return {
      success: false,
      error: `Failed to copy file: ${err instanceof Error ? err.message : String(err)}`
    }
  }

  // Auto-open if requested
  let opened = false
  if (autoOpen) {
    try {
      const openResult = await shell.openPath(targetPath)
      // openPath returns an empty string on success, error message on failure
      opened = openResult === ''
      if (!opened) {
        console.warn('Failed to open file:', openResult)
      }
    } catch (err) {
      console.warn('Failed to open file:', err)
    }
  }

  return {
    success: true,
    exportedPath: targetPath,
    opened
  }
}

/**
 * Open an existing PPTX file with the system default application.
 *
 * @param filePath - Path to the PPTX file
 * @returns Result with success status
 */
export async function openPptx(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    await access(filePath)
  } catch {
    return { success: false, error: `File not found: ${filePath}` }
  }

  try {
    const result = await shell.openPath(filePath)
    if (result !== '') {
      return { success: false, error: result }
    }
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: `Failed to open file: ${err instanceof Error ? err.message : String(err)}`
    }
  }
}

/**
 * Reveal a file in the system file explorer.
 *
 * @param filePath - Path to the file to reveal
 */
export function revealInFinder(filePath: string): void {
  shell.showItemInFolder(filePath)
}

// ---------------------------------------------------------------------------
// PDF Export (Optional - requires LibreOffice)
// ---------------------------------------------------------------------------

/**
 * Check if LibreOffice is available for PDF conversion.
 */
export async function isLibreOfficeAvailable(): Promise<boolean> {
  try {
    await execAsync('libreoffice --version')
    return true
  } catch {
    return false
  }
}

/**
 * Export a PPTX file to PDF using LibreOffice headless mode.
 *
 * @param options - PDF export options
 * @returns Result with success status and path
 */
export async function exportPdf(options: PdfExportOptions): Promise<PdfExportResult> {
  const { sourcePath, suggestedName, autoOpen = true } = options

  // Verify source file exists
  try {
    await access(sourcePath)
  } catch {
    return {
      success: false,
      error: `Source file not found: ${sourcePath}`
    }
  }

  // Check if LibreOffice is available
  const hasLibreOffice = await isLibreOfficeAvailable()
  if (!hasLibreOffice) {
    return {
      success: false,
      error: 'PDF export requires LibreOffice. Install LibreOffice to enable this feature.'
    }
  }

  // Generate suggested filename
  const baseName = suggestedName
    ? suggestedName.replace(/\.pptx$/i, '.pdf')
    : generatePdfFilename(sourcePath)

  // Show native save dialog
  const result = await dialog.showSaveDialog({
    title: 'Export as PDF',
    defaultPath: join(app.getPath('documents'), baseName),
    filters: [
      { name: 'PDF Document', extensions: ['pdf'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['createDirectory', 'showOverwriteConfirmation']
  })

  // User cancelled
  if (result.canceled || !result.filePath) {
    return {
      success: false,
      error: 'Export cancelled by user'
    }
  }

  const targetPath = result.filePath
  const targetDir = dirname(targetPath)

  // Ensure target directory exists
  try {
    await mkdir(targetDir, { recursive: true })
  } catch {
    // Directory may already exist
  }

  // Convert using LibreOffice
  try {
    // LibreOffice outputs to the specified directory with auto-generated name
    // We need to move/rename the file after conversion
    const tempDir = app.getPath('temp')
    await execAsync(`libreoffice --headless --convert-to pdf --outdir "${tempDir}" "${sourcePath}"`)

    // Calculate expected temp file path
    const tempPdfName = basename(sourcePath).replace(/\.pptx$/i, '.pdf')
    const tempPdfPath = join(tempDir, tempPdfName)

    // Copy to target location
    await copyFile(tempPdfPath, targetPath)
  } catch (err) {
    return {
      success: false,
      error: `PDF conversion failed: ${err instanceof Error ? err.message : String(err)}`
    }
  }

  // Auto-open if requested
  let opened = false
  if (autoOpen) {
    try {
      const openResult = await shell.openPath(targetPath)
      opened = openResult === ''
    } catch {
      // Ignore open errors
    }
  }

  return {
    success: true,
    exportedPath: targetPath,
    opened
  }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Generate a default filename for export.
 */
function generateDefaultFilename(sourcePath: string): string {
  const original = basename(sourcePath)
  const ext = extname(original)
  const name = original.replace(ext, '')

  // If it already has a timestamp-like suffix, use as-is
  if (/\d{13}$/.test(name)) {
    return original
  }

  // Add a friendly timestamp
  const date = new Date()
  const timestamp = date.toISOString().slice(0, 10).replace(/-/g, '')
  return `${name}-${timestamp}${ext}`
}

/**
 * Generate a default PDF filename.
 */
function generatePdfFilename(sourcePath: string): string {
  const original = basename(sourcePath)
  return original.replace(/\.pptx$/i, '.pdf')
}

/**
 * Quick export: save to a predefined location without dialog.
 * Useful for auto-save functionality.
 */
export async function quickExport(
  sourceBuffer: Buffer,
  filename: string
): Promise<{ success: boolean; path?: string; error?: string }> {
  const exportDir = join(app.getPath('documents'), 'Encore Exports')

  try {
    await mkdir(exportDir, { recursive: true })
  } catch {
    // Directory may exist
  }

  const targetPath = join(exportDir, filename)

  try {
    const { writeFile } = await import('node:fs/promises')
    await writeFile(targetPath, sourceBuffer)
    return { success: true, path: targetPath }
  } catch (err) {
    return {
      success: false,
      error: `Failed to save file: ${err instanceof Error ? err.message : String(err)}`
    }
  }
}

/**
 * Get the content of a PPTX file as a buffer.
 * Useful for creating download responses.
 */
export async function getPptxBuffer(filePath: string): Promise<Buffer | null> {
  try {
    return await readFile(filePath)
  } catch {
    return null
  }
}
