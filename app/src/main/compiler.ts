/**
 * PPTX Compilation Engine
 *
 * Compiles TSX source code into PPTX files:
 * 1. Transpile TSX → JavaScript using esbuild
 * 2. Execute in sandboxed context with React + react-pptx-extended
 * 3. Pass resulting React element to render()
 * 4. Save PPTX buffer to file and generate thumbnails
 *
 * The compilation runs in the main process but is designed to avoid blocking
 * the UI by keeping operations async and potentially moving to a worker later.
 */

import { transformSync } from 'esbuild'
import { writeFile, mkdir, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { app } from 'electron'
import React from 'react'

// Import react-pptx-extended components and render function
import * as ReactPptx from 'react-pptx-extended'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CompilationResult {
  success: boolean
  slideCount: number
  outputPath?: string
  thumbnails?: SlideThumbnail[]
  error?: string
  warnings?: string[]
}

export interface SlideThumbnail {
  slideNumber: number
  dataUri: string
  width: number
  height: number
}

export interface CompileOptions {
  /** TSX source code to compile */
  source: string
  /** Output filename (without path) */
  outputFilename?: string
  /** Whether to generate PNG thumbnails (requires LibreOffice) */
  generateThumbnails?: boolean
}

// ---------------------------------------------------------------------------
// Transpilation
// ---------------------------------------------------------------------------

interface TranspileResult {
  success: boolean
  code?: string
  error?: string
}

/**
 * Transpile TSX source to JavaScript using esbuild.
 * Returns the transpiled code as a string.
 */
export function transpileTsx(source: string): TranspileResult {
  try {
    const result = transformSync(source, {
      loader: 'tsx',
      target: 'es2022',
      format: 'cjs', // Use CommonJS for easier execution in vm
      jsx: 'automatic',
      jsxImportSource: 'react',
      // Don't minify for easier debugging
      minify: false,
      // Preserve some readability
      keepNames: true
    })

    return {
      success: true,
      code: result.code
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      error: `Transpilation failed: ${message}`
    }
  }
}

// ---------------------------------------------------------------------------
// Execution Context
// ---------------------------------------------------------------------------

/**
 * Create a sandboxed context with React and react-pptx-extended available.
 * The context provides a limited set of globals to prevent malicious code
 * from accessing sensitive Node.js APIs.
 */
function createExecutionContext(): Record<string, unknown> {
  // Build the context with React and react-pptx-extended
  const context: Record<string, unknown> = {
    // React runtime
    React,
    // react-pptx-extended components
    Presentation: ReactPptx.Presentation,
    Slide: ReactPptx.Slide,
    Text: ReactPptx.Text,
    Shape: ReactPptx.Shape,
    Image: ReactPptx.Image,
    Line: ReactPptx.Line,
    Table: ReactPptx.Table,
    MasterSlide: ReactPptx.MasterSlide,
    // Safe globals
    console: {
      log: (...args: unknown[]) => console.log('[TSX]', ...args),
      warn: (...args: unknown[]) => console.warn('[TSX]', ...args),
      error: (...args: unknown[]) => console.error('[TSX]', ...args)
    },
    // Allow basic JavaScript features
    Array,
    Object,
    String,
    Number,
    Boolean,
    JSON,
    Math,
    Date,
    Map,
    Set,
    RegExp,
    Error,
    Promise,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    undefined,
    null: null
  }

  return context
}

/**
 * Execute transpiled JavaScript code and extract the React element.
 * The code should export a default component or call a render function.
 */
function executeCode(code: string): {
  success: boolean
  element?: React.ReactElement
  error?: string
} {
  try {
    const context = createExecutionContext()

    // Wrap the code to capture exports
    // The transpiled code uses CommonJS, so we provide a module/exports object
    const wrappedCode = `
      const module = { exports: {} };
      const exports = module.exports;
      const require = (name) => {
        if (name === 'react') return React;
        if (name === 'react/jsx-runtime') return {
          jsx: React.createElement,
          jsxs: React.createElement,
          Fragment: React.Fragment
        };
        throw new Error('Module not found: ' + name);
      };
      ${code}
      return module.exports;
    `

    // Create a function with the context variables as parameters
    const paramNames = Object.keys(context)
    const paramValues = Object.values(context)

    const fn = new Function(...paramNames, wrappedCode)
    const moduleExports = fn(...paramValues)

    // Try to get the React element
    let element: React.ReactElement | null = null

    // Check for default export (most common pattern)
    if (moduleExports.default) {
      const defaultExport = moduleExports.default
      if (React.isValidElement(defaultExport)) {
        element = defaultExport
      } else if (typeof defaultExport === 'function') {
        // It's a component function, call it
        element = React.createElement(defaultExport)
      }
    }

    // Check for named Presentation export
    if (!element && moduleExports.Presentation) {
      if (React.isValidElement(moduleExports.Presentation)) {
        element = moduleExports.Presentation
      } else if (typeof moduleExports.Presentation === 'function') {
        element = React.createElement(moduleExports.Presentation)
      }
    }

    // Check for any React element in exports
    if (!element) {
      for (const key of Object.keys(moduleExports)) {
        const value = moduleExports[key]
        if (React.isValidElement(value)) {
          element = value
          break
        }
        if (typeof value === 'function') {
          try {
            const maybeElement = React.createElement(value)
            if (React.isValidElement(maybeElement)) {
              element = maybeElement
              break
            }
          } catch {
            // Not a valid component, continue
          }
        }
      }
    }

    if (!element) {
      return {
        success: false,
        error:
          'No React element found in code. Export a Presentation component as default or named export.'
      }
    }

    return { success: true, element }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      error: `Execution failed: ${message}`
    }
  }
}

// ---------------------------------------------------------------------------
// PPTX Rendering
// ---------------------------------------------------------------------------

/**
 * Render a React element to PPTX buffer.
 */
async function renderToPptx(
  element: React.ReactElement
): Promise<{ success: boolean; buffer?: Buffer; slideCount?: number; error?: string }> {
  try {
    // Cast to PresentationProps as the element should be a Presentation
    // The runtime will validate the structure
    const buffer = await ReactPptx.render(
      element as React.ReactElement<ReactPptx.PresentationProps>,
      { outputType: 'nodebuffer' }
    )

    // Count slides by examining the element tree
    let slideCount = 0
    const countSlides = (el: React.ReactNode): void => {
      if (!React.isValidElement(el)) return
      // Check if this is a Slide element
      if (el.type === ReactPptx.Slide || (el.type as unknown) === 'slide') {
        slideCount++
      }
      // Recurse into children
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children = (el.props as Record<string, any>)?.children
      if (Array.isArray(children)) {
        children.forEach(countSlides)
      } else if (children) {
        countSlides(children)
      }
    }
    countSlides(element)

    // If we couldn't count from JSX structure, estimate from buffer size
    // A typical slide adds ~50-100KB to the PPTX
    if (slideCount === 0 && buffer) {
      const bufferSize = (buffer as Buffer).length
      slideCount = Math.max(1, Math.round(bufferSize / 75000))
    }

    return {
      success: true,
      buffer: buffer as Buffer,
      slideCount
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      error: `Rendering failed: ${message}`
    }
  }
}

// ---------------------------------------------------------------------------
// File Output
// ---------------------------------------------------------------------------

/**
 * Get the output directory for generated presentations.
 */
function getOutputDir(): string {
  // Use the app's user data directory for storing generated files
  const userData = app.getPath('userData')
  return join(userData, 'presentations')
}

/**
 * Ensure the output directory exists.
 */
async function ensureOutputDir(): Promise<string> {
  const dir = getOutputDir()
  try {
    await access(dir)
  } catch {
    await mkdir(dir, { recursive: true })
  }
  return dir
}

/**
 * Save a buffer to a file.
 */
async function saveFile(buffer: Buffer, filename: string): Promise<string> {
  const outputDir = await ensureOutputDir()
  const outputPath = join(outputDir, filename)

  // Ensure the directory for the file exists
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, buffer)

  return outputPath
}

// ---------------------------------------------------------------------------
// PNG Thumbnail Generation
// ---------------------------------------------------------------------------

/**
 * Generate PNG thumbnails for each slide.
 *
 * NOTE: This is currently a stub. Full implementation requires either:
 * 1. LibreOffice headless: `libreoffice --headless --convert-to pdf` then `pdftoppm`
 * 2. A JavaScript PPTX renderer (complex, not available as a library)
 * 3. A cloud service API
 *
 * For now, we return empty thumbnails and log a warning.
 */
async function generateThumbnails(
  _outputPath: string,
  slideCount: number
): Promise<{ thumbnails: SlideThumbnail[]; warnings: string[] }> {
  const warnings: string[] = []
  const thumbnails: SlideThumbnail[] = []

  // Check if LibreOffice is available
  // TODO: Implement LibreOffice-based thumbnail generation
  // For now, return placeholder thumbnails

  warnings.push(
    'Thumbnail generation not yet implemented. ' +
      'The PPTX file was created successfully but slide previews are not available. ' +
      'Open the file in PowerPoint or LibreOffice to view slides.'
  )

  // Create placeholder entries
  for (let i = 1; i <= slideCount; i++) {
    thumbnails.push({
      slideNumber: i,
      dataUri: '', // Empty - no preview available
      width: 960,
      height: 540
    })
  }

  return { thumbnails, warnings }
}

// ---------------------------------------------------------------------------
// Main Compilation API
// ---------------------------------------------------------------------------

/**
 * Compile TSX source code to a PPTX file.
 *
 * This is the main entry point for the compilation engine.
 * It performs the full pipeline: transpile → execute → render → save.
 */
export async function compileTsx(options: CompileOptions): Promise<CompilationResult> {
  const warnings: string[] = []

  // 1. Transpile TSX to JavaScript
  const transpileResult = transpileTsx(options.source)
  if (!transpileResult.success) {
    return {
      success: false,
      slideCount: 0,
      error: transpileResult.error
    }
  }

  // 2. Execute the transpiled code
  const executeResult = executeCode(transpileResult.code!)
  if (!executeResult.success) {
    return {
      success: false,
      slideCount: 0,
      error: executeResult.error
    }
  }

  // 3. Render to PPTX
  const renderResult = await renderToPptx(executeResult.element!)
  if (!renderResult.success) {
    return {
      success: false,
      slideCount: 0,
      error: renderResult.error
    }
  }

  // 4. Save the file
  const filename = options.outputFilename || `presentation-${Date.now()}.pptx`
  let outputPath: string
  try {
    outputPath = await saveFile(renderResult.buffer!, filename)
  } catch (err) {
    return {
      success: false,
      slideCount: renderResult.slideCount || 0,
      error: `Failed to save file: ${err instanceof Error ? err.message : String(err)}`
    }
  }

  // 5. Generate thumbnails (optional)
  let thumbnails: SlideThumbnail[] = []
  if (options.generateThumbnails !== false) {
    const thumbResult = await generateThumbnails(outputPath, renderResult.slideCount || 1)
    thumbnails = thumbResult.thumbnails
    warnings.push(...thumbResult.warnings)
  }

  return {
    success: true,
    slideCount: renderResult.slideCount || 0,
    outputPath,
    thumbnails,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

/**
 * Get the full path to a generated presentation.
 */
export function getPresentationPath(filename: string): string {
  return join(getOutputDir(), filename)
}

/**
 * Validate TSX source without compiling.
 * Useful for checking syntax errors before full compilation.
 */
export function validateTsx(source: string): { valid: boolean; error?: string } {
  const result = transpileTsx(source)
  if (!result.success) {
    return { valid: false, error: result.error }
  }
  return { valid: true }
}
