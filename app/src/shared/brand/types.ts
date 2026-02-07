/**
 * Brand Kit Types — Pluggable theme system for Encore presentations
 *
 * A BrandKit defines the complete visual identity for generated presentations:
 * - Color palette (primary, accent, neutrals, semantic)
 * - Typography (fonts, size scale)
 * - Shadows (elevation presets)
 * - Layout preferences
 *
 * Users can define custom brand kits or use built-in presets.
 * The AI system prompt will incorporate the active brand kit.
 */

// ---------------------------------------------------------------------------
// Color System
// ---------------------------------------------------------------------------

/**
 * A color scale from lightest (50) to darkest (900)
 */
export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string // Primary shade
  600: string
  700: string
  800: string
  900: string
}

/**
 * Semantic colors for feedback and status
 */
export interface SemanticColors {
  success: string
  error: string
  warning: string
  info: string
}

/**
 * Complete color palette for a brand
 */
export interface BrandColors {
  /** Primary brand color scale (main accent) */
  primary: ColorScale
  /** Optional secondary accent scale */
  secondary?: ColorScale
  /** Neutral gray scale (backgrounds, text, borders) */
  neutral: ColorScale
  /** Semantic feedback colors */
  semantic: SemanticColors
  /** Core colors */
  black: string
  white: string
}

// ---------------------------------------------------------------------------
// Typography System
// ---------------------------------------------------------------------------

/**
 * Font family definitions
 */
export interface BrandFonts {
  /** Display/headline font — should be distinctive */
  display: string
  /** Body text font — should be readable */
  body: string
  /** Metrics/numbers font — optional, defaults to body */
  metric?: string
  /** Monospace font for code — optional */
  mono?: string
}

/**
 * Typography preset for a specific text role
 */
export interface TypographyPreset {
  fontSize: number // in points
  fontFace: string
  bold?: boolean
  italic?: boolean
  lineSpacing?: number // in points
  charSpacing?: number // character spacing
}

/**
 * Complete typography system
 */
export interface BrandTypography {
  fonts: BrandFonts
  presets: {
    // Display
    hero: TypographyPreset
    display: TypographyPreset
    // Headings
    h1: TypographyPreset
    h2: TypographyPreset
    h3: TypographyPreset
    h4: TypographyPreset
    // Body
    lead: TypographyPreset
    body: TypographyPreset
    bodySmall: TypographyPreset
    // Labels
    label: TypographyPreset
    caption: TypographyPreset
    overline: TypographyPreset
    // Metrics
    metricLarge: TypographyPreset
    metric: TypographyPreset
    metricSmall: TypographyPreset
    metricUnit: TypographyPreset
    // Cards
    cardTitle: TypographyPreset
    cardBody: TypographyPreset
  }
}

// ---------------------------------------------------------------------------
// Shadow System
// ---------------------------------------------------------------------------

/**
 * Shadow properties matching react-pptx-extended ShadowProps
 */
export interface ShadowPreset {
  type: 'outer' | 'inner' | 'none'
  blur: number // points
  offset: number // points
  angle: number // degrees
  color: string // hex WITHOUT # prefix
  opacity: number // 0-1
}

/**
 * Shadow presets for different elevation levels
 */
export interface BrandShadows {
  none: ShadowPreset
  subtle: ShadowPreset
  soft: ShadowPreset
  medium: ShadowPreset
  strong: ShadowPreset
  /** Theme-specific card shadow */
  card: ShadowPreset
}

// ---------------------------------------------------------------------------
// Theme Variants
// ---------------------------------------------------------------------------

/**
 * Semantic color mappings for a specific theme variant (dark/light)
 */
export interface ThemeVariant {
  name: string
  /** Background color */
  bg: string
  /** Alternative/secondary background */
  bgAlt: string
  /** Card/surface background */
  surface: string
  /** Primary text color */
  text: string
  /** Secondary/muted text color */
  textSecondary: string
  /** Disabled/very muted text */
  textMuted: string
  /** Primary accent color */
  accent: string
  /** Lighter accent for backgrounds/borders */
  accentLight: string
  /** Border color */
  border: string
}

// ---------------------------------------------------------------------------
// Complete Brand Kit
// ---------------------------------------------------------------------------

/**
 * Complete brand kit defining all visual identity aspects
 */
export interface BrandKit {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Optional description */
  description?: string
  /** Color palette */
  colors: BrandColors
  /** Typography system */
  typography: BrandTypography
  /** Shadow presets */
  shadows: BrandShadows
  /** Pre-defined theme variants */
  themes: {
    dark: ThemeVariant
    light: ThemeVariant
    [key: string]: ThemeVariant // additional custom themes
  }
  /** Optional brand metadata */
  meta?: {
    company?: string
    website?: string
    logoBase64?: string
    createdAt?: string
    updatedAt?: string
  }
}

// ---------------------------------------------------------------------------
// Brand Kit Context (for AI system prompt)
// ---------------------------------------------------------------------------

/**
 * Serialized brand kit context for injection into AI system prompt.
 * This is a condensed format optimized for LLM consumption.
 */
export interface BrandKitContext {
  /** Brand kit ID */
  id: string
  /** Brand name */
  name: string
  /** Active theme variant name */
  activeTheme: string
  /** Color variables for the active theme */
  colors: {
    bg: string
    bgAlt: string
    surface: string
    text: string
    textSecondary: string
    textMuted: string
    accent: string
    accentLight: string
    border: string
    // Full palette access
    primary500: string
    neutral900: string
    neutral100: string
  }
  /** Font family names */
  fonts: {
    display: string
    body: string
    metric: string
  }
  /** Key typography sizes */
  sizes: {
    hero: number
    h1: number
    h2: number
    body: number
    caption: number
    metricLarge: number
  }
  /** Recommended shadow for cards */
  cardShadow: ShadowPreset
}
