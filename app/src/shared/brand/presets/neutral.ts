/**
 * Neutral Brand Kit — Default theme for Encore
 *
 * A sophisticated, neutral palette that works for any presentation.
 * Based on cool grays with amber accent for warmth.
 * Follows frontend-design skill principles.
 */

import type { BrandKit } from '../types'

/**
 * Neutral color scale — cool grays with slight warmth
 */
const neutralScale = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717'
} as const

/**
 * Amber accent scale — warm, inviting accent color
 */
const amberScale = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f'
} as const

export const neutralBrandKit: BrandKit = {
  id: 'neutral',
  name: 'Neutral',
  description:
    'A sophisticated, neutral palette with amber accents. Works for any professional presentation.',

  colors: {
    primary: amberScale,
    neutral: neutralScale,
    semantic: {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    },
    black: '#000000',
    white: '#ffffff'
  },

  typography: {
    fonts: {
      display: 'Helvetica Neue',
      body: 'Georgia',
      metric: 'Helvetica Neue',
      mono: 'Consolas'
    },
    presets: {
      // Display
      hero: { fontSize: 54, fontFace: 'Helvetica Neue', bold: true },
      display: { fontSize: 44, fontFace: 'Helvetica Neue', bold: true },
      // Headings
      h1: { fontSize: 32, fontFace: 'Helvetica Neue', bold: true },
      h2: { fontSize: 24, fontFace: 'Helvetica Neue', bold: true },
      h3: { fontSize: 18, fontFace: 'Georgia', bold: true },
      h4: { fontSize: 14, fontFace: 'Georgia', bold: true },
      // Body
      lead: { fontSize: 18, fontFace: 'Georgia', lineSpacing: 26 },
      body: { fontSize: 14, fontFace: 'Georgia', lineSpacing: 20 },
      bodySmall: { fontSize: 12, fontFace: 'Georgia', lineSpacing: 18 },
      // Labels
      label: { fontSize: 11, fontFace: 'Helvetica Neue', bold: true, charSpacing: 2 },
      caption: { fontSize: 10, fontFace: 'Georgia' },
      overline: { fontSize: 10, fontFace: 'Helvetica Neue', bold: true, charSpacing: 3 },
      // Metrics
      metricLarge: { fontSize: 72, fontFace: 'Helvetica Neue', bold: true },
      metric: { fontSize: 48, fontFace: 'Helvetica Neue', bold: true },
      metricSmall: { fontSize: 32, fontFace: 'Helvetica Neue', bold: true },
      metricUnit: { fontSize: 18, fontFace: 'Georgia' },
      // Cards
      cardTitle: { fontSize: 16, fontFace: 'Georgia', bold: true },
      cardBody: { fontSize: 12, fontFace: 'Georgia', lineSpacing: 16 }
    }
  },

  shadows: {
    none: { type: 'none', blur: 0, offset: 0, angle: 0, color: '000000', opacity: 0 },
    subtle: { type: 'outer', blur: 6, offset: 2, angle: 90, color: '000000', opacity: 0.08 },
    soft: { type: 'outer', blur: 12, offset: 4, angle: 90, color: '000000', opacity: 0.1 },
    medium: { type: 'outer', blur: 16, offset: 6, angle: 135, color: '000000', opacity: 0.12 },
    strong: { type: 'outer', blur: 24, offset: 8, angle: 135, color: '000000', opacity: 0.15 },
    card: { type: 'outer', blur: 10, offset: 3, angle: 135, color: '000000', opacity: 0.1 }
  },

  themes: {
    dark: {
      name: 'Dark',
      bg: neutralScale[900],
      bgAlt: neutralScale[800],
      surface: neutralScale[800],
      text: '#ffffff',
      textSecondary: neutralScale[400],
      textMuted: neutralScale[500],
      accent: amberScale[500],
      accentLight: amberScale[900],
      border: neutralScale[700]
    },
    light: {
      name: 'Light',
      bg: '#ffffff',
      bgAlt: neutralScale[50],
      surface: '#ffffff',
      text: neutralScale[900],
      textSecondary: neutralScale[600],
      textMuted: neutralScale[400],
      accent: amberScale[600],
      accentLight: amberScale[100],
      border: neutralScale[200]
    }
  }
}
