/**
 * Tool Execution Handlers — Main process implementations.
 *
 * Each handler function runs in the Electron main process with full Node.js access.
 * They implement the actual logic for each AI tool:
 *   - write_presentation_code: Store TSX source, update AI context
 *   - edit_presentation_code: Apply search-and-replace edits to current TSX
 *   - compile_pptx: Trigger TSX -> PPTX compilation (stub until compilation engine task)
 *   - read_local_file: Read files from disk with encoding detection
 *   - web_search: Search the web (stub — requires external API or Electron net)
 *   - fetch_image: Download image from URL, return as base64
 */

import { readFile, stat } from 'node:fs/promises'
import { extname } from 'node:path'
import { net } from 'electron'

import type {
  WritePresentationCodeInput,
  EditPresentationCodeInput,
  CompilePptxInput,
  ReadLocalFileInput,
  WebSearchInput,
  FetchImageInput,
  WritePresentationCodeResult,
  EditPresentationCodeResult,
  CompilePptxResult,
  ReadLocalFileResult,
  WebSearchResult,
  FetchImageResult
} from '../shared/tools'

import { setCurrentTsx } from './ai-service'

// ---------------------------------------------------------------------------
// State: current TSX source (shared with ai-service via setCurrentTsx)
// ---------------------------------------------------------------------------

/** The current TSX source code for the presentation */
let currentTsxSource: string = ''

/** Callback for when TSX source changes (set by IPC handlers) */
let onTsxChangeCallback: ((code: string, previousCode: string) => void) | null = null

/** Get the current TSX source */
export function getCurrentTsx(): string {
  return currentTsxSource
}

/**
 * Set the current TSX source from user edits.
 * Updates both local state and AI context.
 */
export function setTsx(code: string): void {
  const previousCode = currentTsxSource
  currentTsxSource = code
  setCurrentTsx(code)
  if (onTsxChangeCallback) {
    onTsxChangeCallback(code, previousCode)
  }
}

/** Register a callback for TSX changes (from AI tools) */
export function onTsxChange(callback: (code: string, previousCode: string) => void): void {
  onTsxChangeCallback = callback
}

// ---------------------------------------------------------------------------
// MIME type lookup
// ---------------------------------------------------------------------------

const MIME_TYPES: Record<string, string> = {
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.csv': 'text/csv',
  '.json': 'application/json',
  '.tsx': 'text/typescript-jsx',
  '.ts': 'text/typescript',
  '.js': 'application/javascript',
  '.jsx': 'text/jsx',
  '.html': 'text/html',
  '.css': 'text/css',
  '.xml': 'text/xml',
  '.yaml': 'text/yaml',
  '.yml': 'text/yaml',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon'
}

const TEXT_EXTENSIONS = new Set([
  '.txt',
  '.md',
  '.csv',
  '.json',
  '.tsx',
  '.ts',
  '.js',
  '.jsx',
  '.html',
  '.css',
  '.xml',
  '.yaml',
  '.yml',
  '.svg'
])

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.ico', '.svg'])

// ---------------------------------------------------------------------------
// Tool handlers
// ---------------------------------------------------------------------------

/**
 * write_presentation_code — Write or replace the full TSX source.
 */
export async function handleWritePresentationCode(
  input: WritePresentationCodeInput
): Promise<WritePresentationCodeResult> {
  try {
    const previousCode = currentTsxSource
    currentTsxSource = input.code
    setCurrentTsx(currentTsxSource)

    // Notify of TSX change (for editor sync)
    if (onTsxChangeCallback) {
      onTsxChangeCallback(currentTsxSource, previousCode)
    }

    const lineCount = input.code.split('\n').length
    return { success: true, lineCount }
  } catch (err) {
    return {
      success: false,
      lineCount: 0,
      error: err instanceof Error ? err.message : String(err)
    }
  }
}

/**
 * edit_presentation_code — Apply targeted search-and-replace edits.
 */
export async function handleEditPresentationCode(
  input: EditPresentationCodeInput
): Promise<EditPresentationCodeResult> {
  if (!currentTsxSource) {
    return {
      success: false,
      editsApplied: 0,
      lineCount: 0,
      editResults: [],
      error: 'No presentation code exists yet. Use write_presentation_code first.'
    }
  }

  let source = currentTsxSource
  const editResults: EditPresentationCodeResult['editResults'] = []
  let appliedCount = 0

  for (let i = 0; i < input.edits.length; i++) {
    const edit = input.edits[i]

    // Verify the search string exists exactly once
    const occurrences = source.split(edit.search).length - 1

    if (occurrences === 0) {
      editResults.push({
        index: i,
        applied: false,
        error: `Search string not found in source (edit ${i})`
      })
      continue
    }

    if (occurrences > 1) {
      editResults.push({
        index: i,
        applied: false,
        error: `Search string found ${occurrences} times — must be unique (edit ${i}). Add more surrounding context.`
      })
      continue
    }

    // Apply the edit
    source = source.replace(edit.search, edit.replace)
    editResults.push({ index: i, applied: true })
    appliedCount++
  }

  // Update state
  const previousCode = currentTsxSource
  currentTsxSource = source
  setCurrentTsx(currentTsxSource)

  // Notify of TSX change (for editor sync)
  if (onTsxChangeCallback) {
    onTsxChangeCallback(currentTsxSource, previousCode)
  }

  const lineCount = source.split('\n').length
  const allApplied = appliedCount === input.edits.length

  return {
    success: allApplied,
    editsApplied: appliedCount,
    lineCount,
    editResults,
    error: allApplied
      ? undefined
      : `${appliedCount}/${input.edits.length} edits applied. Check editResults for details.`
  }
}

/**
 * compile_pptx — Trigger TSX -> PPTX compilation.
 *
 * STUB: Returns a placeholder result. The actual compilation engine will be
 * implemented in the "PPTX compilation engine" task. This stub allows the
 * AI agent loop to function and test tool-calling flow.
 */
export async function handleCompilePptx(input: CompilePptxInput): Promise<CompilePptxResult> {
  if (!currentTsxSource) {
    return {
      success: false,
      slideCount: 0,
      error: 'No presentation code to compile. Use write_presentation_code first.'
    }
  }

  // TODO: Implement actual compilation in "PPTX compilation engine" task.
  // This stub allows the agent loop and tool-calling flow to work end-to-end.
  void input.outputFilename

  return {
    success: false,
    slideCount: 0,
    error:
      'Compilation engine not yet implemented. ' +
      'The TSX source has been saved and can be compiled once the engine is ready.',
    warnings: ['compile_pptx is a stub — compilation engine will be implemented in a later task']
  }
}

/**
 * read_local_file — Read a file from the user's filesystem.
 */
export async function handleReadLocalFile(input: ReadLocalFileInput): Promise<ReadLocalFileResult> {
  try {
    const ext = extname(input.filePath).toLowerCase()
    const mimeType = MIME_TYPES[ext] ?? 'application/octet-stream'
    const isText = TEXT_EXTENSIONS.has(ext)
    const isImage = IMAGE_EXTENSIONS.has(ext)

    // Determine encoding
    const encoding = input.encoding ?? (isText ? 'utf-8' : 'base64')
    const isBase64 = encoding === 'base64'

    // Get file stats
    const fileStat = await stat(input.filePath)
    const fileSize = fileStat.size

    // Safety check: don't read files larger than 10MB
    const MAX_FILE_SIZE = 10 * 1024 * 1024
    if (fileSize > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File too large (${(fileSize / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`
      }
    }

    // Read file
    const buffer = await readFile(input.filePath)
    let content: string

    if (isBase64 || isImage || ext === '.pdf') {
      content = buffer.toString('base64')
    } else {
      content = buffer.toString('utf-8')
    }

    // For text files, truncate if extremely long (>100K chars) to avoid context overflow
    const MAX_TEXT_LENGTH = 100_000
    if (!isBase64 && content.length > MAX_TEXT_LENGTH) {
      content = content.slice(0, MAX_TEXT_LENGTH) + '\n\n[... truncated — file exceeds 100K chars]'
    }

    return {
      success: true,
      content,
      mimeType,
      fileSize,
      isBase64: isBase64 || isImage || ext === '.pdf'
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err)
    }
  }
}

/**
 * web_search — Search the web for content.
 *
 * STUB: Web search requires an external API (e.g. Brave Search, Bing, Tavily).
 * This will be wired up when settings/API key management is built.
 * For now, returns a helpful message directing the AI to use other tools.
 */
export async function handleWebSearch(input: WebSearchInput): Promise<WebSearchResult> {
  // TODO: Integrate with a search API (Brave Search, Tavily, etc.)
  void input.maxResults
  // This requires an API key which will be configured in the Settings task.
  return {
    success: false,
    error:
      'Web search is not yet configured. ' +
      'A search API key needs to be set up in Settings. ' +
      `Attempted query: "${input.query}". ` +
      'For now, use your training knowledge or ask the user to provide the information directly.'
  }
}

/**
 * fetch_image — Download an image from a URL and return as base64.
 */
export async function handleFetchImage(input: FetchImageInput): Promise<FetchImageResult> {
  try {
    // Use Electron's net module (handles CORS, proxy settings, etc.)
    const response = await net.fetch(input.url, {
      headers: {
        'User-Agent': 'Encore/0.1.0 (Presentation Generator)'
      }
    })

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      }
    }

    const contentType = response.headers.get('content-type') ?? 'image/png'
    const mimeType = contentType.split(';')[0].trim()

    // Verify it looks like an image
    if (!mimeType.startsWith('image/')) {
      return {
        success: false,
        error: `URL returned non-image content type: ${mimeType}`
      }
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Safety check: don't download images larger than 20MB
    const MAX_IMAGE_SIZE = 20 * 1024 * 1024
    if (buffer.length > MAX_IMAGE_SIZE) {
      return {
        success: false,
        error: `Image too large (${(buffer.length / 1024 / 1024).toFixed(1)}MB). Maximum is 20MB.`
      }
    }

    const base64Data = buffer.toString('base64')
    const dataUri = `data:${mimeType};base64,${base64Data}`

    return {
      success: true,
      base64Data,
      mimeType,
      fileSize: buffer.length,
      dataUri
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err)
    }
  }
}
