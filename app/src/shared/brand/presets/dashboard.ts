/**
 * Dashboard Brand Kit — Data-forward design
 *
 * Optimized for metrics, charts, and information-dense slides.
 * Clean, technical aesthetic with high readability.
 * Follows frontend-design skill principles.
 */

import type { BrandKit } from '../types'

/**
 * Zinc scale — neutral, technical grays
 */
const zincScale = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b'
} as const

/**
 * Emerald accent scale — data/success-oriented accent
 */
const emeraldScale = {
  50: '#ecfdf5',
  100: '#d1fae5',
  200: '#a7f3d0',
  300: '#6ee7b7',
  400: '#34d399',
  500: '#10b981',
  600: '#059669',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b'
} as const

/**
 * Cyan secondary scale — for data visualization variety
 */
const cyanScale = {
  50: '#ecfeff',
  100: '#cffafe',
  200: '#a5f3fc',
  300: '#67e8f9',
  400: '#22d3ee',
  500: '#06b6d4',
  600: '#0891b2',
  700: '#0e7490',
  800: '#155e75',
  900: '#164e63'
} as const

export const dashboardBrandKit: BrandKit = {
  id: 'dashboard',
  name: 'Dashboard',
  description:
    'Data-forward design optimized for metrics, charts, and analytics. Clean technical aesthetic.',

  colors: {
    primary: emeraldScale,
    secondary: cyanScale,
    neutral: zincScale,
    semantic: {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#0ea5e9'
    },
    black: '#09090b',
    white: '#fafafa'
  },

  typography: {
    fonts: {
      display: 'Futura',
      body: 'Avenir',
      metric: 'Futura',
      mono: 'SF Mono'
    },
    presets: {
      // Display — geometric, modern
      hero: { fontSize: 52, fontFace: 'Futura', bold: true },
      display: { fontSize: 40, fontFace: 'Futura', bold: true },
      // Headings
      h1: { fontSize: 32, fontFace: 'Futura', bold: true },
      h2: { fontSize: 24, fontFace: 'Futura', bold: true },
      h3: { fontSize: 16, fontFace: 'Avenir', bold: true },
      h4: { fontSize: 13, fontFace: 'Avenir', bold: true },
      // Body — clean, scannable
      lead: { fontSize: 16, fontFace: 'Avenir', lineSpacing: 24 },
      body: { fontSize: 13, fontFace: 'Avenir', lineSpacing: 20 },
      bodySmall: { fontSize: 11, fontFace: 'Avenir', lineSpacing: 16 },
      // Labels
      label: { fontSize: 10, fontFace: 'Futura', bold: true, charSpacing: 2 },
      caption: { fontSize: 9, fontFace: 'Avenir' },
      overline: { fontSize: 9, fontFace: 'Futura', bold: true, charSpacing: 3 },
      // Metrics — large, bold, data-focused
      metricLarge: { fontSize: 84, fontFace: 'Futura', bold: true },
      metric: { fontSize: 56, fontFace: 'Futura', bold: true },
      metricSmall: { fontSize: 36, fontFace: 'Futura', bold: true },
      metricUnit: { fontSize: 14, fontFace: 'Avenir' },
      // Cards — compact, information-dense
      cardTitle: { fontSize: 14, fontFace: 'Avenir', bold: true },
      cardBody: { fontSize: 11, fontFace: 'Avenir', lineSpacing: 16 }
    }
  },

  shadows: {
    none: { type: 'none', blur: 0, offset: 0, angle: 0, color: '000000', opacity: 0 },
    subtle: { type: 'outer', blur: 4, offset: 1, angle: 90, color: '000000', opacity: 0.06 },
    soft: { type: 'outer', blur: 8, offset: 2, angle: 90, color: '000000', opacity: 0.08 },
    medium: { type: 'outer', blur: 12, offset: 3, angle: 135, color: '000000', opacity: 0.1 },
    strong: { type: 'outer', blur: 16, offset: 4, angle: 135, color: '000000', opacity: 0.12 },
    card: { type: 'outer', blur: 6, offset: 2, angle: 90, color: '000000', opacity: 0.05 }
  },

  themes: {
    dark: {
      name: 'Dashboard Dark',
      bg: '#09090b', // Almost pure black
      bgAlt: zincScale[900],
      surface: zincScale[800],
      text: zincScale[50],
      textSecondary: zincScale[400],
      textMuted: zincScale[500],
      accent: emeraldScale[400],
      accentLight: emeraldScale[900],
      border: zincScale[700]
    },
    light: {
      name: 'Dashboard Light',
      bg: zincScale[50],
      bgAlt: '#ffffff',
      surface: '#ffffff',
      text: zincScale[900],
      textSecondary: zincScale[600],
      textMuted: zincScale[400],
      accent: emeraldScale[600],
      accentLight: emeraldScale[100],
      border: zincScale[200]
    }
  }
}
