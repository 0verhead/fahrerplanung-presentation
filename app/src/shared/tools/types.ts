/**
 * Tool Result Types — Structured output types for all AI tools.
 *
 * These define the shape of results returned from tool execution handlers.
 * The AI receives these as tool call results and uses them to continue reasoning.
 */

// ---------------------------------------------------------------------------
// write_presentation_code
// ---------------------------------------------------------------------------

export interface WritePresentationCodeResult {
  success: boolean
  /** Number of lines in the written code */
  lineCount: number
  /** Error message if write failed */
  error?: string
}

// ---------------------------------------------------------------------------
// edit_presentation_code
// ---------------------------------------------------------------------------

export interface EditPresentationCodeResult {
  success: boolean
  /** Number of edits successfully applied */
  editsApplied: number
  /** Total number of lines after edits */
  lineCount: number
  /** Per-edit results (in order) */
  editResults: Array<{
    index: number
    applied: boolean
    error?: string
  }>
  /** Error message if the overall operation failed */
  error?: string
}

// ---------------------------------------------------------------------------
// compile_pptx
// ---------------------------------------------------------------------------

export interface CompilePptxResult {
  success: boolean
  /** Number of slides in the compiled presentation */
  slideCount: number
  /** Path to the generated .pptx file */
  outputPath?: string
  /** Per-slide PNG thumbnail data (base64) — for preview */
  slideThumbnails?: Array<{
    slideIndex: number
    /** base64-encoded PNG image data */
    dataUri: string
  }>
  /** Error message if compilation failed */
  error?: string
  /** Compilation warnings (non-fatal) */
  warnings?: string[]
}

// ---------------------------------------------------------------------------
// read_local_file
// ---------------------------------------------------------------------------

export interface ReadLocalFileResult {
  success: boolean
  /** The file content (text or base64-encoded binary) */
  content?: string
  /** MIME type of the file */
  mimeType?: string
  /** File size in bytes */
  fileSize?: number
  /** Whether content is base64-encoded */
  isBase64?: boolean
  /** Error message if read failed */
  error?: string
}

// ---------------------------------------------------------------------------
// web_search
// ---------------------------------------------------------------------------

export interface WebSearchResult {
  success: boolean
  /** Search results */
  results?: Array<{
    title: string
    url: string
    snippet: string
  }>
  /** Total number of results found */
  totalResults?: number
  /** Error message if search failed */
  error?: string
}

// ---------------------------------------------------------------------------
// fetch_image
// ---------------------------------------------------------------------------

export interface FetchImageResult {
  success: boolean
  /** base64-encoded image data */
  base64Data?: string
  /** MIME type (e.g. "image/png", "image/jpeg") */
  mimeType?: string
  /** Image size in bytes */
  fileSize?: number
  /** Data URI string ready for embedding (e.g. "data:image/png;base64,...") */
  dataUri?: string
  /** Error message if fetch failed */
  error?: string
}
