/**
 * Brand Kit Type Definitions
 *
 * A BrandKit defines all the visual tokens for a presentation theme:
 * colors, typography, shadows, and layout. The AI uses this to generate
 * on-brand presentations. Users can provide brand info via chat or settings,
 * and the AI incorporates these tokens into generated TSX code.
 */

// ---------------------------------------------------------------------------
// Color System
// ---------------------------------------------------------------------------

/**
 * Core color palette - the essential colors for a brand
 */
export interface BrandColors {
  /** Primary brand accent color (e.g., "#ff550a") */
  accent: string
  /** Lighter variant of accent for hover/focus states */
  accentLight: string
  /** Darker variant of accent for pressed states */
  accentDark: string

  /** Primary background color */
  background: string
  /** Alternative background for contrast areas */
  backgroundAlt: string

  /** Surface color for cards, panels */
  surface: string
  /** Elevated surface with more prominence */
  surfaceElevated: string

  /** Primary text color */
  text: string
  /** Secondary/muted text color */
  textSecondary: string
  /** Tertiary/disabled text color */
  textMuted: string

  /** Border color for subtle separators */
  border: string
  /** Strong border color for emphasis */
  borderStrong: string
}

/**
 * Semantic colors for status and feedback
 */
export interface SemanticColors {
  success: string
  successDim: string
  warning: string
  warningDim: string
  error: string
  errorDim: string
  info: string
  infoDim: string
}

/**
 * Complete color system
 */
export interface ColorSystem {
  brand: BrandColors
  semantic: SemanticColors
}

// ---------------------------------------------------------------------------
// Typography System
// ---------------------------------------------------------------------------

/**
 * Font family configuration
 */
export interface FontFamilies {
  /** Display/headline font (distinctive, memorable) */
  display: string
  /** Body text font (readable, professional) */
  body: string
  /** Monospace font for code/metrics */
  mono?: string
}

/**
 * Typography preset for a specific text style
 */
export interface TypographyPreset {
  fontSize: number
  fontFace: string
  bold?: boolean
  italic?: boolean
  lineSpacing?: number
  charSpacing?: number
}

/**
 * Complete typography scale
 */
export interface TypographyScale {
  /** Hero headline - largest, used once per presentation max */
  hero: TypographyPreset
  /** Display headline - section openers */
  display: TypographyPreset
  /** H1 - Slide titles */
  h1: TypographyPreset
  /** H2 - Section headers */
  h2: TypographyPreset
  /** H3 - Card/subsection titles */
  h3: TypographyPreset
  /** H4 - Small headings */
  h4: TypographyPreset
  /** Lead paragraph - intro text */
  lead: TypographyPreset
  /** Body - main content */
  body: TypographyPreset
  /** Body small - secondary content */
  bodySmall: TypographyPreset
  /** Label - section markers, categories */
  label: TypographyPreset
  /** Caption - footnotes, supporting text */
  caption: TypographyPreset
  /** Metric large - hero numbers */
  metricLarge: TypographyPreset
  /** Metric - standard data points */
  metric: TypographyPreset
  /** Metric small - card metrics */
  metricSmall: TypographyPreset
}

// ---------------------------------------------------------------------------
// Shadow System
// ---------------------------------------------------------------------------

/**
 * Shadow configuration matching react-pptx-extended ShadowProps
 */
export interface ShadowPreset {
  type: 'outer' | 'inner' | 'none'
  blur: number
  offset: number
  angle: number
  /** Hex color WITHOUT # prefix */
  color: string
  opacity: number
}

/**
 * Shadow presets for different elevation levels
 */
export interface ShadowScale {
  /** No shadow */
  none: ShadowPreset
  /** Barely visible, for subtle separation */
  subtle: ShadowPreset
  /** Light elevation for cards */
  soft: ShadowPreset
  /** Clear elevation for highlighted content */
  medium: ShadowPreset
  /** Prominent elevation for hero elements */
  strong: ShadowPreset
  /** Inset shadow for pressed states */
  inner: ShadowPreset
}

// ---------------------------------------------------------------------------
// Layout System
// ---------------------------------------------------------------------------

/**
 * Spacing scale in inches (for PPTX coordinates)
 */
export interface SpacingScale {
  xxs: number
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
}

/**
 * Border radius scale in inches
 */
export interface RadiusScale {
  none: number
  sm: number
  md: number
  lg: number
  xl: number
  pill: number
}

/**
 * Layout configuration
 */
export interface LayoutConfig {
  /** Slide dimensions */
  slide: {
    width: number
    height: number
  }
  /** Safe margins from edges */
  margins: {
    left: number
    right: number
    top: number
    bottom: number
  }
  /** Spacing tokens */
  spacing: SpacingScale
  /** Border radius tokens */
  radius: RadiusScale
}

// ---------------------------------------------------------------------------
// Brand Kit
// ---------------------------------------------------------------------------

/**
 * Theme mode - affects which preset to use
 */
export type ThemeMode = 'dark' | 'light'

/**
 * Complete Brand Kit definition
 *
 * Contains all visual tokens needed for generating on-brand presentations.
 * The AI reads this and uses the values when writing TSX code.
 */
export interface BrandKit {
  /** Unique identifier for this brand kit */
  id: string
  /** Display name for the brand kit */
  name: string
  /** Optional description */
  description?: string
  /** Theme mode (dark or light) */
  mode: ThemeMode

  /** Color system */
  colors: ColorSystem

  /** Font families */
  fonts: FontFamilies

  /** Typography scale */
  typography: TypographyScale

  /** Shadow presets */
  shadows: ShadowScale

  /** Layout configuration */
  layout: LayoutConfig
}

/**
 * Minimal brand input that users can provide
 * The AI or system can expand this into a full BrandKit
 */
export interface BrandInput {
  /** Company/project name */
  name: string
  /** Primary accent color (hex) */
  accentColor?: string
  /** Preferred theme mode */
  mode?: ThemeMode
  /** Display font preference */
  displayFont?: string
  /** Body font preference */
  bodyFont?: string
  /** Industry/style keywords for AI guidance */
  style?: string
}
