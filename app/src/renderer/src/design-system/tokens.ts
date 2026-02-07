/**
 * Encore Design Tokens — TypeScript reference
 *
 * These mirror the CSS custom properties in tokens.css.
 * Use for programmatic access (e.g., canvas rendering, dynamic styles).
 * For standard UI, prefer Tailwind utilities or CSS variables directly.
 */

export const colors = {
  surface: {
    ground: '#08080a',
    base: '#0c0c0f',
    raised: '#111114',
    overlay: '#161619',
    elevated: '#1c1c20',
    highest: '#232328'
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    default: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.16)',
    accent: 'rgba(245, 166, 35, 0.4)'
  },
  text: {
    primary: '#ededef',
    secondary: '#a0a0a8',
    tertiary: '#636370',
    disabled: '#43434d',
    inverse: '#08080a',
    accent: '#f5a623'
  },
  accent: {
    dim: '#3d2a07',
    muted: '#6b4a0f',
    default: '#f5a623',
    bright: '#fbbf4e',
    vivid: '#fcd778'
  },
  semantic: {
    success: '#34d399',
    successDim: '#0d3025',
    warning: '#fbbf24',
    warningDim: '#3d2f07',
    error: '#f87171',
    errorDim: '#3d1414',
    info: '#60a5fa',
    infoDim: '#0f2440'
  }
} as const

export const fonts = {
  display: "'Bricolage Grotesque', system-ui, sans-serif",
  body: "'Geist Sans', system-ui, sans-serif",
  mono: "'Geist Mono', ui-monospace, 'SF Mono', 'Cascadia Code', monospace"
} as const

export const fontSizes = {
  '2xs': '0.625rem',
  xs: '0.75rem',
  sm: '0.8125rem',
  base: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.375rem',
  '2xl': '1.75rem',
  '3xl': '2.25rem',
  hero: '3.5rem'
} as const

export const radii = {
  none: '0',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px'
} as const

export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.3)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 8px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 24px -3px rgba(0, 0, 0, 0.5), 0 4px 8px -4px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 40px -5px rgba(0, 0, 0, 0.5), 0 8px 16px -8px rgba(0, 0, 0, 0.4)',
  glow: '0 0 20px rgba(245, 166, 35, 0.15), 0 0 40px rgba(245, 166, 35, 0.05)',
  glowStrong: '0 0 30px rgba(245, 166, 35, 0.25), 0 0 60px rgba(245, 166, 35, 0.1)'
} as const

export const transitions = {
  fast: '100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  normal: '200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  slow: '350ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  slower: '500ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  spring: '350ms cubic-bezier(0.34, 1.56, 0.64, 1)'
} as const
