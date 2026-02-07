/**
 * Tool Schemas — Zod-typed input schemas for all AI tools.
 *
 * These schemas define the shape of each tool's input parameters.
 * They are used by the AI SDK v6 `tool()` helper to validate LLM-generated inputs
 * and to generate the JSON Schema that the LLM sees in its tool specification.
 *
 * Each schema has rich `.describe()` annotations so the LLM understands
 * what each parameter does and how to use it.
 */

import { z } from 'zod'

// ---------------------------------------------------------------------------
// write_presentation_code
// ---------------------------------------------------------------------------

export const writePresentationCodeSchema = z.object({
  code: z
    .string()
    .describe(
      'The complete TSX source code for the presentation. ' +
        'Must be a valid TypeScript/React module that default-exports a function component ' +
        'returning a <Presentation> element from react-pptx-extended. ' +
        'Include all imports at the top.'
    ),
  description: z
    .string()
    .optional()
    .describe(
      'A brief description of the design direction and what this presentation contains. ' +
        'Shown to the user in the chat.'
    )
})

export type WritePresentationCodeInput = z.infer<typeof writePresentationCodeSchema>

// ---------------------------------------------------------------------------
// edit_presentation_code
// ---------------------------------------------------------------------------

export const editPresentationCodeSchema = z.object({
  edits: z
    .array(
      z.object({
        search: z
          .string()
          .describe(
            'The exact string to find in the current TSX source. ' +
              'Must match exactly (whitespace-sensitive). ' +
              'Use enough context to be unique in the file.'
          ),
        replace: z
          .string()
          .describe('The replacement string. Can be empty to delete the matched text.')
      })
    )
    .describe(
      'An array of search-and-replace operations to apply to the current TSX source. ' +
        'Applied in order. Each edit must match exactly one location in the source.'
    ),
  description: z
    .string()
    .optional()
    .describe('A brief description of what these edits accomplish. Shown to the user in the chat.')
})

export type EditPresentationCodeInput = z.infer<typeof editPresentationCodeSchema>

// ---------------------------------------------------------------------------
// compile_pptx
// ---------------------------------------------------------------------------

export const compilePptxSchema = z.object({
  outputFilename: z
    .string()
    .optional()
    .describe(
      'Optional filename for the output .pptx file (without path). ' +
        'Defaults to "presentation.pptx" if not provided.'
    )
})

export type CompilePptxInput = z.infer<typeof compilePptxSchema>

// ---------------------------------------------------------------------------
// read_local_file
// ---------------------------------------------------------------------------

export const readLocalFileSchema = z.object({
  filePath: z
    .string()
    .describe(
      'The absolute path to the file to read. ' +
        'Supported formats: text files (.txt, .md, .csv, .json, .tsx, .ts, .js), ' +
        'PDFs (.pdf), and images (.png, .jpg, .jpeg, .gif, .webp, .svg). ' +
        'For images, returns base64-encoded data. For PDFs, extracts text content.'
    ),
  encoding: z
    .enum(['utf-8', 'base64'])
    .optional()
    .describe(
      'The encoding to use when reading the file. ' +
        'Defaults to "utf-8" for text files, "base64" for binary/images.'
    )
})

export type ReadLocalFileInput = z.infer<typeof readLocalFileSchema>

// ---------------------------------------------------------------------------
// web_search
// ---------------------------------------------------------------------------

export const webSearchSchema = z.object({
  query: z
    .string()
    .describe(
      'The search query. Be specific and descriptive. ' +
        'Good for finding: industry data, company information, design inspiration, ' +
        'stock image URLs, color palettes, typography trends.'
    ),
  maxResults: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .describe('Maximum number of results to return. Defaults to 5.')
})

export type WebSearchInput = z.infer<typeof webSearchSchema>

// ---------------------------------------------------------------------------
// fetch_image
// ---------------------------------------------------------------------------

export const fetchImageSchema = z.object({
  url: z.string().url().describe('The URL of the image to download. Must be a valid HTTP(S) URL.'),
  description: z
    .string()
    .optional()
    .describe(
      'A brief description of the image for accessibility and context. ' +
        'Used as alt text if embedded in the presentation.'
    )
})

export type FetchImageInput = z.infer<typeof fetchImageSchema>
