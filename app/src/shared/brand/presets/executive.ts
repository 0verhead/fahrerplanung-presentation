/**
 * Executive Brand Kit — Sophisticated dark theme
 *
 * Deep navy backgrounds with gold accents.
 * Premium, boardroom-ready aesthetic.
 * Follows frontend-design skill principles.
 */

import type { BrandKit } from '../types'

/**
 * Slate scale — cool, professional grays with blue undertone
 */
const slateScale = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a'
} as const

/**
 * Gold accent scale — luxurious, refined accent
 */
const goldScale = {
  50: '#fefce8',
  100: '#fef9c3',
  200: '#fef08a',
  300: '#fde047',
  400: '#facc15',
  500: '#eab308',
  600: '#ca8a04',
  700: '#a16207',
  800: '#854d0e',
  900: '#713f12'
} as const

export const executiveBrandKit: BrandKit = {
  id: 'executive',
  name: 'Executive',
  description:
    'Sophisticated dark theme with gold accents. Perfect for boardroom presentations and premium pitches.',

  colors: {
    primary: goldScale,
    neutral: slateScale,
    semantic: {
      success: '#10b981',
      error: '#f43f5e',
      warning: '#f59e0b',
      info: '#0ea5e9'
    },
    black: '#000000',
    white: '#ffffff'
  },

  typography: {
    fonts: {
      display: 'Didot',
      body: 'Optima',
      metric: 'Didot',
      mono: 'Menlo'
    },
    presets: {
      // Display — elegant serif for headlines
      hero: { fontSize: 56, fontFace: 'Didot', bold: false },
      display: { fontSize: 44, fontFace: 'Didot', bold: false },
      // Headings
      h1: { fontSize: 36, fontFace: 'Didot', bold: false },
      h2: { fontSize: 28, fontFace: 'Didot', bold: false },
      h3: { fontSize: 18, fontFace: 'Optima', bold: true },
      h4: { fontSize: 14, fontFace: 'Optima', bold: true },
      // Body — humanist sans for readability
      lead: { fontSize: 18, fontFace: 'Optima', lineSpacing: 28 },
      body: { fontSize: 14, fontFace: 'Optima', lineSpacing: 22 },
      bodySmall: { fontSize: 12, fontFace: 'Optima', lineSpacing: 18 },
      // Labels
      label: { fontSize: 11, fontFace: 'Optima', bold: true, charSpacing: 3 },
      caption: { fontSize: 10, fontFace: 'Optima' },
      overline: { fontSize: 10, fontFace: 'Optima', bold: true, charSpacing: 4 },
      // Metrics — elegant numbers
      metricLarge: { fontSize: 80, fontFace: 'Didot', bold: false },
      metric: { fontSize: 54, fontFace: 'Didot', bold: false },
      metricSmall: { fontSize: 36, fontFace: 'Didot', bold: false },
      metricUnit: { fontSize: 16, fontFace: 'Optima' },
      // Cards
      cardTitle: { fontSize: 16, fontFace: 'Optima', bold: true },
      cardBody: { fontSize: 12, fontFace: 'Optima', lineSpacing: 18 }
    }
  },

  shadows: {
    none: { type: 'none', blur: 0, offset: 0, angle: 0, color: '000000', opacity: 0 },
    subtle: { type: 'outer', blur: 8, offset: 2, angle: 180, color: '000000', opacity: 0.2 },
    soft: { type: 'outer', blur: 12, offset: 4, angle: 180, color: '000000', opacity: 0.25 },
    medium: { type: 'outer', blur: 20, offset: 6, angle: 135, color: '000000', opacity: 0.3 },
    strong: { type: 'outer', blur: 30, offset: 10, angle: 135, color: '000000', opacity: 0.35 },
    card: { type: 'outer', blur: 16, offset: 4, angle: 180, color: '000000', opacity: 0.35 }
  },

  themes: {
    dark: {
      name: 'Executive Dark',
      bg: '#0a0f1a', // Deep navy, almost black
      bgAlt: slateScale[900],
      surface: slateScale[800],
      text: '#f8fafc',
      textSecondary: slateScale[300],
      textMuted: slateScale[500],
      accent: goldScale[400],
      accentLight: goldScale[900],
      border: slateScale[700]
    },
    light: {
      name: 'Executive Light',
      bg: '#fefce8', // Warm cream
      bgAlt: '#ffffff',
      surface: '#ffffff',
      text: slateScale[900],
      textSecondary: slateScale[600],
      textMuted: slateScale[400],
      accent: goldScale[600],
      accentLight: goldScale[100],
      border: slateScale[200]
    }
  }
}
