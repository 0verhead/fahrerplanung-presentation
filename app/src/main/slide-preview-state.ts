/**
 * Slide Preview State — Manages the current slide preview state.
 *
 * This module tracks the slide preview state and notifies listeners
 * when slides are compiled or updated. The actual compilation engine
 * will be implemented in a separate task.
 */

import type { SlidePreviewState, SlideThumbnail } from '../shared/types/ai'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** Current slide preview state */
let currentState: SlidePreviewState = {
  hasSlides: false,
  isCompiling: false,
  slideCount: 0,
  slides: []
}

/** Callback for state changes */
let onStateChangeCallback: ((state: SlidePreviewState) => void) | null = null

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get the current slide preview state.
 */
export function getSlidePreviewState(): SlidePreviewState {
  return { ...currentState }
}

/**
 * Set the slide preview state.
 * Notifies listeners of the change.
 */
export function setSlidePreviewState(newState: Partial<SlidePreviewState>): void {
  currentState = { ...currentState, ...newState }
  if (onStateChangeCallback) {
    onStateChangeCallback(currentState)
  }
}

/**
 * Mark compilation as started.
 */
export function startCompilation(): void {
  setSlidePreviewState({
    isCompiling: true,
    error: undefined
  })
}

/**
 * Mark compilation as finished with results.
 */
export function finishCompilation(result: {
  success: boolean
  slideCount: number
  slides: SlideThumbnail[]
  error?: string
  warnings?: string[]
  pptxPath?: string
}): void {
  setSlidePreviewState({
    hasSlides: result.success && result.slideCount > 0,
    isCompiling: false,
    slideCount: result.slideCount,
    slides: result.slides,
    error: result.error,
    warnings: result.warnings,
    pptxPath: result.pptxPath
  })
}

/**
 * Clear all slides (e.g., when TSX is cleared).
 */
export function clearSlides(): void {
  currentState = {
    hasSlides: false,
    isCompiling: false,
    slideCount: 0,
    slides: []
  }
  if (onStateChangeCallback) {
    onStateChangeCallback(currentState)
  }
}

/**
 * Register a callback for state changes.
 */
export function onSlidePreviewStateChange(
  callback: (state: SlidePreviewState) => void
): () => void {
  onStateChangeCallback = callback
  return () => {
    onStateChangeCallback = null
  }
}
