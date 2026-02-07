/**
 * SlidePreviewPanel — Displays compiled slide previews
 *
 * Features:
 * - Renders compiled slide PNG thumbnails
 * - Slide navigation (prev/next, slide indicator)
 * - Zoom controls (fit, 50%, 75%, 100%, 150%)
 * - Loading state during compilation
 * - Error state for compilation failures
 * - Empty state when no slides
 * - Styled per Encore's design system (Refined Dark Studio)
 */

import { useCallback, useEffect, useState } from 'react'
import type { SlidePreviewState, SlidesUpdatedEvent } from '../../../../shared/types/ai'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SlidePreviewPanelProps {
  className?: string
}

type ZoomLevel = 'fit' | 50 | 75 | 100 | 150

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function ChevronLeftIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function ZoomInIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
      />
    </svg>
  )
}

function ZoomOutIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
      />
    </svg>
  )
}

function SlidesIcon(): React.JSX.Element {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
      />
    </svg>
  )
}

function CompileIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
      />
    </svg>
  )
}

function AlertIcon(): React.JSX.Element {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  )
}

function ExportIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  )
}

function OpenExternalIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  )
}

function FolderIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Zoom level utilities
// ---------------------------------------------------------------------------

const ZOOM_LEVELS: ZoomLevel[] = ['fit', 50, 75, 100, 150]

function getNextZoomLevel(current: ZoomLevel, direction: 'in' | 'out'): ZoomLevel {
  const currentIndex = ZOOM_LEVELS.indexOf(current)
  if (direction === 'in' && currentIndex < ZOOM_LEVELS.length - 1) {
    return ZOOM_LEVELS[currentIndex + 1]
  }
  if (direction === 'out' && currentIndex > 0) {
    return ZOOM_LEVELS[currentIndex - 1]
  }
  return current
}

function getZoomLabel(zoom: ZoomLevel): string {
  return zoom === 'fit' ? 'Fit' : `${zoom}%`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SlidePreviewPanel({ className = '' }: SlidePreviewPanelProps): React.JSX.Element {
  const [previewState, setPreviewState] = useState<SlidePreviewState>({
    hasSlides: false,
    isCompiling: false,
    slideCount: 0,
    slides: []
  })
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('fit')
  const [isLoading, setIsLoading] = useState(true)

  // ---------------------------------------------------------------------------
  // Load initial state and subscribe to updates
  // ---------------------------------------------------------------------------

  useEffect(() => {
    // Load initial slide state
    window.api.getSlides().then((state) => {
      setPreviewState(state)
      setIsLoading(false)
    })

    // Subscribe to slide updates
    const unsubscribe = window.api.onSlidesUpdated((event: SlidesUpdatedEvent) => {
      setPreviewState(event.state)
      // Reset to first slide when slides change
      if (event.state.slides.length > 0) {
        setCurrentSlideIndex(0)
      }
    })

    return unsubscribe
  }, [])

  // ---------------------------------------------------------------------------
  // Navigation handlers
  // ---------------------------------------------------------------------------

  const goToPrevSlide = useCallback(() => {
    setCurrentSlideIndex((i) => Math.max(0, i - 1))
  }, [])

  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex((i) => Math.min(previewState.slideCount - 1, i + 1))
  }, [previewState.slideCount])

  // ---------------------------------------------------------------------------
  // Zoom handlers
  // ---------------------------------------------------------------------------

  const zoomIn = useCallback(() => {
    setZoomLevel((z) => getNextZoomLevel(z, 'in'))
  }, [])

  const zoomOut = useCallback(() => {
    setZoomLevel((z) => getNextZoomLevel(z, 'out'))
  }, [])

  // ---------------------------------------------------------------------------
  // Manual compile trigger
  // ---------------------------------------------------------------------------

  const handleCompile = useCallback(async () => {
    const result = await window.api.triggerCompile()
    if (!result.success && result.error) {
      // The error will be shown via the slides updated event
      console.error('Compilation failed:', result.error)
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Export handlers
  // ---------------------------------------------------------------------------

  const [isExporting, setIsExporting] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)

  const handleExportPptx = useCallback(async () => {
    if (!previewState.pptxPath) return
    setIsExporting(true)
    setShowExportMenu(false)
    try {
      const result = await window.api.exportPptx(previewState.pptxPath)
      if (!result.success && result.error && !result.error.includes('cancelled')) {
        console.error('Export failed:', result.error)
      }
    } finally {
      setIsExporting(false)
    }
  }, [previewState.pptxPath])

  const handleExportPdf = useCallback(async () => {
    if (!previewState.pptxPath) return
    setIsExporting(true)
    setShowExportMenu(false)
    try {
      const result = await window.api.exportPdf(previewState.pptxPath)
      if (!result.success && result.error && !result.error.includes('cancelled')) {
        console.error('PDF export failed:', result.error)
      }
    } finally {
      setIsExporting(false)
    }
  }, [previewState.pptxPath])

  const handleOpenPptx = useCallback(async () => {
    if (!previewState.pptxPath) return
    setShowExportMenu(false)
    const result = await window.api.openPptx(previewState.pptxPath)
    if (!result.success && result.error) {
      console.error('Failed to open file:', result.error)
    }
  }, [previewState.pptxPath])

  const handleRevealInFinder = useCallback(() => {
    if (!previewState.pptxPath) return
    setShowExportMenu(false)
    window.api.revealInFinder(previewState.pptxPath)
  }, [previewState.pptxPath])

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const currentSlide = previewState.slides[currentSlideIndex]
  const hasSlides = previewState.hasSlides && previewState.slides.length > 0

  // Calculate image style based on zoom
  const getImageStyle = (): React.CSSProperties => {
    if (zoomLevel === 'fit') {
      return { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' as const }
    }
    return { width: `${(zoomLevel / 100) * 960}px`, height: 'auto' }
  }

  // ---------------------------------------------------------------------------
  // Render: Loading state
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className={`flex h-full flex-col bg-surface-ground ${className}`}>
        <div className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-2">
          <span className="text-label tracking-widest text-text-tertiary">PREVIEW</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-default border-t-transparent" />
            <span className="text-caption text-text-tertiary">Loading preview...</span>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Render: Compiling state
  // ---------------------------------------------------------------------------

  if (previewState.isCompiling) {
    return (
      <div className={`flex h-full flex-col bg-surface-ground ${className}`}>
        <div className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-2">
          <span className="text-label tracking-widest text-text-tertiary">PREVIEW</span>
          <span className="animate-pulse text-caption text-accent-default">Compiling...</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-surface-elevated border-t-accent-default" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CompileIcon />
              </div>
            </div>
            <div className="text-center">
              <p className="text-body text-text-primary">Compiling presentation...</p>
              <p className="mt-1 text-caption text-text-tertiary">This may take a few seconds</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Render: Error state
  // ---------------------------------------------------------------------------

  if (previewState.error && !hasSlides) {
    return (
      <div className={`flex h-full flex-col bg-surface-ground ${className}`}>
        <div className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-2">
          <span className="text-label tracking-widest text-text-tertiary">PREVIEW</span>
          <span className="text-caption text-error">Error</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <div className="flex max-w-sm flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-error-dim">
              <AlertIcon />
            </div>
            <div>
              <h3 className="text-title text-text-primary">Compilation Failed</h3>
              <p className="mt-2 text-sm text-text-secondary">{previewState.error}</p>
            </div>
            <button
              onClick={handleCompile}
              className="mt-2 flex items-center gap-2 rounded-md bg-surface-raised px-4 py-2 text-sm text-text-primary transition-fast hover:bg-surface-overlay"
            >
              <CompileIcon />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Render: Empty state
  // ---------------------------------------------------------------------------

  if (!hasSlides) {
    return (
      <div className={`flex h-full flex-col bg-surface-ground ${className}`}>
        <div className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-2">
          <span className="text-label tracking-widest text-text-tertiary">PREVIEW</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-raised text-text-tertiary">
              <SlidesIcon />
            </div>
            <h3 className="text-title text-text-primary">No slides yet</h3>
            <p className="max-w-48 text-sm text-text-tertiary">
              Start a conversation in the chat to generate your presentation. Slides will appear
              here once compiled.
            </p>
            <button
              onClick={handleCompile}
              disabled={true}
              className="mt-2 flex cursor-not-allowed items-center gap-2 rounded-md bg-surface-raised px-4 py-2 text-sm text-text-disabled opacity-50"
            >
              <CompileIcon />
              Compile Preview
            </button>
            <span className="text-2xs text-text-disabled">Write presentation code first</span>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Render: Slides preview
  // ---------------------------------------------------------------------------

  return (
    <div className={`flex h-full flex-col bg-surface-ground ${className}`}>
      {/* Header with slide info */}
      <div className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-2">
        <span className="text-label tracking-widest text-text-tertiary">PREVIEW</span>
        <span className="text-caption text-text-secondary">
          {previewState.slideCount} slide{previewState.slideCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Warnings banner */}
      {previewState.warnings && previewState.warnings.length > 0 && (
        <div className="border-b border-warning-dim bg-warning-dim px-4 py-2">
          <div className="flex items-start gap-2">
            <AlertIcon />
            <div className="flex-1">
              {previewState.warnings.map((warning, i) => (
                <p key={i} className="text-xs text-warning">
                  {warning}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slide preview area */}
      <div className="relative flex flex-1 items-center justify-center overflow-auto bg-surface-ground p-4">
        {currentSlide ? (
          <div
            className="flex items-center justify-center"
            style={zoomLevel === 'fit' ? { width: '100%', height: '100%' } : {}}
          >
            <img
              src={currentSlide.dataUri}
              alt={`Slide ${currentSlideIndex + 1}`}
              style={getImageStyle()}
              className="rounded-md shadow-lg"
            />
          </div>
        ) : (
          <div className="text-sm text-text-tertiary">No preview available for this slide</div>
        )}
      </div>

      {/* Bottom toolbar: navigation + zoom */}
      <div className="flex items-center justify-between border-t border-border bg-surface-raised px-3 py-2">
        {/* Navigation controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrevSlide}
            disabled={currentSlideIndex === 0}
            className="rounded p-1.5 text-text-secondary transition-fast hover:bg-surface-overlay hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-secondary"
            title="Previous slide"
          >
            <ChevronLeftIcon />
          </button>

          <span className="min-w-[4rem] text-center text-sm text-text-primary">
            {currentSlideIndex + 1} / {previewState.slideCount}
          </span>

          <button
            onClick={goToNextSlide}
            disabled={currentSlideIndex >= previewState.slideCount - 1}
            className="rounded p-1.5 text-text-secondary transition-fast hover:bg-surface-overlay hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-secondary"
            title="Next slide"
          >
            <ChevronRightIcon />
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={zoomLevel === 'fit'}
            className="rounded p-1.5 text-text-secondary transition-fast hover:bg-surface-overlay hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-secondary"
            title="Zoom out"
          >
            <ZoomOutIcon />
          </button>

          <span className="min-w-[3.5rem] text-center text-xs text-text-secondary">
            {getZoomLabel(zoomLevel)}
          </span>

          <button
            onClick={zoomIn}
            disabled={zoomLevel === 150}
            className="rounded p-1.5 text-text-secondary transition-fast hover:bg-surface-overlay hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-secondary"
            title="Zoom in"
          >
            <ZoomInIcon />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Compile button */}
          <button
            onClick={handleCompile}
            className="flex items-center gap-1.5 rounded bg-surface-overlay px-3 py-1.5 text-xs font-medium text-text-secondary transition-fast hover:bg-surface-elevated hover:text-text-primary"
            title="Recompile presentation"
          >
            <CompileIcon />
            Compile
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={!previewState.pptxPath || isExporting}
              className="flex items-center gap-1.5 rounded bg-accent-dim px-3 py-1.5 text-xs font-medium text-accent-bright transition-fast hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
              title="Export presentation"
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-bright border-t-transparent" />
                  Exporting...
                </>
              ) : (
                <>
                  <ExportIcon />
                  Export
                </>
              )}
            </button>

            {/* Export dropdown menu */}
            {showExportMenu && previewState.pptxPath && (
              <>
                {/* Backdrop to close menu */}
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />

                <div className="absolute right-0 bottom-full z-50 mb-2 w-48 overflow-hidden rounded-lg border border-border bg-surface-overlay shadow-elevated">
                  <button
                    onClick={handleExportPptx}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-text-primary transition-fast hover:bg-surface-elevated"
                  >
                    <ExportIcon />
                    Save as .pptx
                  </button>
                  <button
                    onClick={handleExportPdf}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-text-primary transition-fast hover:bg-surface-elevated"
                  >
                    <ExportIcon />
                    Save as .pdf
                  </button>
                  <div className="my-1 h-px bg-border" />
                  <button
                    onClick={handleOpenPptx}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-text-primary transition-fast hover:bg-surface-elevated"
                  >
                    <OpenExternalIcon />
                    Open in PowerPoint
                  </button>
                  <button
                    onClick={handleRevealInFinder}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-text-primary transition-fast hover:bg-surface-elevated"
                  >
                    <FolderIcon />
                    Show in Folder
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail strip (optional - for quick navigation) */}
      {previewState.slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-t border-border bg-surface-base p-2">
          {previewState.slides.map((slide, index) => (
            <button
              key={slide.slideIndex}
              onClick={() => setCurrentSlideIndex(index)}
              className={`flex-shrink-0 overflow-hidden rounded-md border-2 transition-fast ${
                index === currentSlideIndex
                  ? 'border-accent-default shadow-glow'
                  : 'border-transparent hover:border-border-strong'
              }`}
            >
              <img
                src={slide.dataUri}
                alt={`Slide ${index + 1} thumbnail`}
                className="h-12 w-auto"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
