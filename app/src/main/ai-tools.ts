/**
 * AI Tools — Zod-typed tool definitions for the AI SDK v6 pipeline.
 *
 * Each tool is defined using the AI SDK v6 `tool()` helper with:
 *   - `description` — LLM-facing description
 *   - `inputSchema` — Zod schema for validated inputs
 *   - `execute` — async handler that runs in the main process
 *
 * The `createEncoreTools()` function returns a `ToolSet` (Record<string, Tool>)
 * that plugs directly into `streamText({ tools })`.
 *
 * Tool call lifecycle events (start, result) are forwarded to the renderer
 * via the `onToolEvent` callback for UI status indicators.
 */

import { tool } from 'ai'

import {
  writePresentationCodeSchema,
  editPresentationCodeSchema,
  compilePptxSchema,
  readLocalFileSchema,
  webSearchSchema,
  fetchImageSchema
} from '../shared/tools/schemas'

import {
  handleWritePresentationCode,
  handleEditPresentationCode,
  handleCompilePptx,
  handleReadLocalFile,
  handleWebSearch,
  handleFetchImage
} from './tool-handlers'

// ---------------------------------------------------------------------------
// Tool event callback type
// ---------------------------------------------------------------------------

export interface ToolEvent {
  type: 'tool-call-start' | 'tool-call-result'
  toolCallId: string
  toolName: string
  result?: unknown
}

// ---------------------------------------------------------------------------
// Tool factory
// ---------------------------------------------------------------------------

/** Type alias for the tool set returned by createEncoreTools */
export type EncoreToolSet = ReturnType<typeof createEncoreTools>

/**
 * Create the complete set of AI tools for the Encore pipeline.
 *
 * @param onToolEvent - Optional callback for forwarding tool lifecycle events
 *   to the renderer (for UI status indicators like "Compiling slides...").
 * @returns A `ToolSet` compatible with `streamText({ tools })`.
 */
export function createEncoreTools(
  onToolEvent?: (event: ToolEvent) => void
): Record<string, ReturnType<typeof tool>> {
  return {
    write_presentation_code: tool({
      description:
        'Write or replace the complete TSX source code for the presentation. ' +
        'Use this when creating a new presentation or rewriting from scratch. ' +
        'The code must be a valid TypeScript/React module that default-exports ' +
        'a function component returning a <Presentation> element.',
      inputSchema: writePresentationCodeSchema,
      async execute(input) {
        onToolEvent?.({
          type: 'tool-call-start',
          toolCallId: '',
          toolName: 'write_presentation_code'
        })
        const result = await handleWritePresentationCode(input)
        onToolEvent?.({
          type: 'tool-call-result',
          toolCallId: '',
          toolName: 'write_presentation_code',
          result
        })
        return result
      }
    }),

    edit_presentation_code: tool({
      description:
        'Apply targeted search-and-replace edits to the current TSX source. ' +
        'Use this for small, focused changes instead of rewriting the entire file. ' +
        'Each edit must have a unique search string that appears exactly once in the source. ' +
        'Include enough surrounding context to make the search string unique.',
      inputSchema: editPresentationCodeSchema,
      async execute(input) {
        onToolEvent?.({
          type: 'tool-call-start',
          toolCallId: '',
          toolName: 'edit_presentation_code'
        })
        const result = await handleEditPresentationCode(input)
        onToolEvent?.({
          type: 'tool-call-result',
          toolCallId: '',
          toolName: 'edit_presentation_code',
          result
        })
        return result
      }
    }),

    compile_pptx: tool({
      description:
        'Compile the current TSX source code into a .pptx file. ' +
        'Returns the slide count, per-slide PNG thumbnails for preview, ' +
        'and the output file path. Call this after writing or editing code ' +
        'to verify the presentation renders correctly.',
      inputSchema: compilePptxSchema,
      async execute(input) {
        onToolEvent?.({
          type: 'tool-call-start',
          toolCallId: '',
          toolName: 'compile_pptx'
        })
        const result = await handleCompilePptx(input)
        onToolEvent?.({
          type: 'tool-call-result',
          toolCallId: '',
          toolName: 'compile_pptx',
          result
        })
        return result
      }
    }),

    read_local_file: tool({
      description:
        "Read a file from the user's local filesystem. " +
        'Supports text files (.txt, .md, .csv, .json, .tsx, .ts, .js), ' +
        'PDFs (.pdf), and images (.png, .jpg, .gif, .webp, .svg). ' +
        'Use this when the user shares a file path or asks you to incorporate ' +
        'content from their local files.',
      inputSchema: readLocalFileSchema,
      async execute(input) {
        onToolEvent?.({
          type: 'tool-call-start',
          toolCallId: '',
          toolName: 'read_local_file'
        })
        const result = await handleReadLocalFile(input)
        onToolEvent?.({
          type: 'tool-call-result',
          toolCallId: '',
          toolName: 'read_local_file',
          result
        })
        return result
      }
    }),

    web_search: tool({
      description:
        'Search the web for information, data, images, or inspiration. ' +
        'Use this to find company information, industry statistics, ' +
        'stock image URLs, color palettes, typography trends, or any ' +
        'content the user needs in their presentation.',
      inputSchema: webSearchSchema,
      async execute(input) {
        onToolEvent?.({
          type: 'tool-call-start',
          toolCallId: '',
          toolName: 'web_search'
        })
        const result = await handleWebSearch(input)
        onToolEvent?.({
          type: 'tool-call-result',
          toolCallId: '',
          toolName: 'web_search',
          result
        })
        return result
      }
    }),

    fetch_image: tool({
      description:
        'Download an image from a URL and return it as base64 data. ' +
        'Use this to embed external images in the presentation. ' +
        "Returns a data URI that can be used directly in the <Image> component's src prop.",
      inputSchema: fetchImageSchema,
      async execute(input) {
        onToolEvent?.({
          type: 'tool-call-start',
          toolCallId: '',
          toolName: 'fetch_image'
        })
        const result = await handleFetchImage(input)
        onToolEvent?.({
          type: 'tool-call-result',
          toolCallId: '',
          toolName: 'fetch_image',
          result
        })
        return result
      }
    })
  }
}
