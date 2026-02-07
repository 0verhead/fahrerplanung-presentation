/**
 * Shared tool definitions — schemas and types.
 *
 * Schemas are used by AI SDK v6 `tool()` for input validation.
 * Types define the structured results returned to the AI.
 */

export {
  writePresentationCodeSchema,
  editPresentationCodeSchema,
  compilePptxSchema,
  readLocalFileSchema,
  webSearchSchema,
  fetchImageSchema,
  type WritePresentationCodeInput,
  type EditPresentationCodeInput,
  type CompilePptxInput,
  type ReadLocalFileInput,
  type WebSearchInput,
  type FetchImageInput
} from './schemas'

export type {
  WritePresentationCodeResult,
  EditPresentationCodeResult,
  CompilePptxResult,
  ReadLocalFileResult,
  WebSearchResult,
  FetchImageResult
} from './types'
