/**
 * Editorial Brand Kit — Magazine-inspired design
 *
 * Bold typography, asymmetric layouts, dramatic whitespace.
 * Inspired by print editorial design.
 * Follows frontend-design skill principles.
 */

import type { BrandKit } from '../types'

/**
 * Stone scale — warm, natural grays
 */
const stoneScale = {
  50: '#fafaf9',
  100: '#f5f5f4',
  200: '#e7e5e4',
  300: '#d6d3d1',
  400: '#a8a29e',
  500: '#78716c',
  600: '#57534e',
  700: '#44403c',
  800: '#292524',
  900: '#1c1917'
} as const

/**
 * Rose accent scale — sophisticated, editorial accent
 */
const roseScale = {
  50: '#fff1f2',
  100: '#ffe4e6',
  200: '#fecdd3',
  300: '#fda4af',
  400: '#fb7185',
  500: '#f43f5e',
  600: '#e11d48',
  700: '#be123c',
  800: '#9f1239',
  900: '#881337'
} as const

export const editorialBrandKit: BrandKit = {
  id: 'editorial',
  name: 'Editorial',
  description:
    'Magazine-inspired design with bold typography and dramatic layouts. Perfect for creative pitches and storytelling.',

  colors: {
    primary: roseScale,
    neutral: stoneScale,
    semantic: {
      success: '#16a34a',
      error: '#dc2626',
      warning: '#ea580c',
      info: '#2563eb'
    },
    black: '#0a0a0a',
    white: '#fefefe'
  },

  typography: {
    fonts: {
      display: 'Bodoni MT',
      body: 'Baskerville',
      metric: 'Bodoni MT',
      mono: 'Courier New'
    },
    presets: {
      // Display — dramatic, high-contrast serif
      hero: { fontSize: 64, fontFace: 'Bodoni MT', bold: false, italic: true },
      display: { fontSize: 48, fontFace: 'Bodoni MT', bold: false },
      // Headings
      h1: { fontSize: 40, fontFace: 'Bodoni MT', bold: false },
      h2: { fontSize: 28, fontFace: 'Bodoni MT', bold: false },
      h3: { fontSize: 18, fontFace: 'Baskerville', bold: true },
      h4: { fontSize: 14, fontFace: 'Baskerville', bold: true },
      // Body — classic, readable serif
      lead: { fontSize: 20, fontFace: 'Baskerville', lineSpacing: 30, italic: true },
      body: { fontSize: 14, fontFace: 'Baskerville', lineSpacing: 22 },
      bodySmall: { fontSize: 12, fontFace: 'Baskerville', lineSpacing: 18 },
      // Labels
      label: { fontSize: 10, fontFace: 'Bodoni MT', bold: true, charSpacing: 4 },
      caption: { fontSize: 9, fontFace: 'Baskerville', italic: true },
      overline: { fontSize: 9, fontFace: 'Bodoni MT', bold: true, charSpacing: 5 },
      // Metrics — elegant display numbers
      metricLarge: { fontSize: 88, fontFace: 'Bodoni MT', bold: false },
      metric: { fontSize: 60, fontFace: 'Bodoni MT', bold: false },
      metricSmall: { fontSize: 40, fontFace: 'Bodoni MT', bold: false },
      metricUnit: { fontSize: 14, fontFace: 'Baskerville', italic: true },
      // Cards
      cardTitle: { fontSize: 18, fontFace: 'Bodoni MT', bold: false },
      cardBody: { fontSize: 12, fontFace: 'Baskerville', lineSpacing: 18 }
    }
  },

  shadows: {
    none: { type: 'none', blur: 0, offset: 0, angle: 0, color: '000000', opacity: 0 },
    subtle: { type: 'outer', blur: 4, offset: 2, angle: 90, color: '000000', opacity: 0.05 },
    soft: { type: 'outer', blur: 8, offset: 3, angle: 90, color: '000000', opacity: 0.08 },
    medium: { type: 'outer', blur: 12, offset: 4, angle: 135, color: '000000', opacity: 0.1 },
    strong: { type: 'outer', blur: 20, offset: 6, angle: 135, color: '000000', opacity: 0.12 },
    card: { type: 'outer', blur: 6, offset: 2, angle: 90, color: '000000', opacity: 0.06 }
  },

  themes: {
    dark: {
      name: 'Editorial Dark',
      bg: stoneScale[900],
      bgAlt: stoneScale[800],
      surface: stoneScale[800],
      text: stoneScale[50],
      textSecondary: stoneScale[300],
      textMuted: stoneScale[500],
      accent: roseScale[400],
      accentLight: roseScale[900],
      border: stoneScale[700]
    },
    light: {
      name: 'Editorial Light',
      bg: '#fffefa', // Warm white, like paper
      bgAlt: stoneScale[50],
      surface: '#ffffff',
      text: stoneScale[900],
      textSecondary: stoneScale[600],
      textMuted: stoneScale[400],
      accent: roseScale[600],
      accentLight: roseScale[100],
      border: stoneScale[200]
    }
  }
}
