/**
 * AVEMO Brand Colors
 * Sourced from avemo-group.de and avemo-fleet.de brand research
 * 
 * Note: PptxGenJS expects hex colors WITHOUT the # prefix
 */

// ===========================================
// AVEMO GROUP - Orange Accent Scale
// ===========================================

export const ORANGE = {
  900: '#821c0c',
  800: '#a11f0b',
  700: '#cc2602',
  600: '#ff3a00',  // Hover state
  500: '#ff550a',  // PRIMARY BRAND ACCENT
  400: '#ff7932',  // Focus state
  300: '#ffa96d',
  200: '#ffcda5',
  100: '#ffe8d3',
  50:  '#fff5ec',
} as const;

// ===========================================
// AVEMO FLEET - Blue Accent
// ===========================================

export const BLUE = {
  500: '#4BB4E6',  // AVEMO Fleet primary accent
  400: '#6BC4ED',
  300: '#8DD4F4',
  200: '#B0E4FA',
  100: '#D8F2FD',
} as const;

// ===========================================
// WARM NEUTRAL SCALE (AVEMO's warm grays)
// ===========================================

export const GRAY = {
  900: '#221d1d',  // Darkest - dark mode background
  850: '#2d2828',  // Secondary dark
  800: '#433e3e',  // Dark cards/inputs
  700: '#625e5e',  // Secondary text (dark mode)
  600: '#767272',  // Muted
  500: '#9e9a9a',  // Disabled
  400: '#bdb9b9',  // Borders, disabled text
  300: '#e0dcdc',  // Light borders
  200: '#edebeb',  // Footer background
  100: '#f4f2f2',  // Card backgrounds
  50:  '#f9f8f8',  // Hover states, subtle bg
} as const;

// ===========================================
// CORE COLORS
// ===========================================

export const CORE = {
  black: '#000000',
  white: '#FFFFFF',
  warmWhite: '#faf9f8',  // AVEMO Fleet warm white
} as const;

// ===========================================
// SEMANTIC COLORS
// ===========================================

export const SEMANTIC = {
  success: '#12b76a',
  error: '#f04438',
  warning: '#f79009',
  info: '#0ba5ec',
} as const;

// ===========================================
// THEME PALETTES
// ===========================================

/**
 * Executive Black Theme - Dark mode for boardroom presentations
 */
export const THEME_DARK = {
  bg: GRAY[900],
  bgAlt: GRAY[850],
  card: GRAY[800],
  text: CORE.white,
  textSecondary: GRAY[500],
  textMuted: GRAY[600],
  accent: ORANGE[500],
  accentLight: ORANGE[400],
  border: GRAY[700],
} as const;

/**
 * Clean White Theme - Light mode Swiss design
 */
export const THEME_LIGHT = {
  bg: CORE.white,
  bgAlt: GRAY[50],
  card: CORE.white,
  text: CORE.black,
  textSecondary: GRAY[700],
  textMuted: GRAY[500],
  accent: ORANGE[500],
  accentLight: ORANGE[100],
  border: GRAY[300],
} as const;

/**
 * Warm Professional Theme - AVEMO Fleet style
 */
export const THEME_WARM = {
  bg: CORE.warmWhite,
  bgAlt: GRAY[100],
  card: CORE.white,
  text: CORE.black,
  textSecondary: GRAY[700],
  textMuted: GRAY[500],
  accent: BLUE[500],
  accentLight: BLUE[100],
  border: GRAY[300],
} as const;

/**
 * Data Dashboard Theme - Metrics focused
 */
export const THEME_DATA = {
  bg: GRAY[100],
  bgAlt: GRAY[50],
  card: CORE.white,
  text: CORE.black,
  textSecondary: GRAY[700],
  textMuted: GRAY[500],
  accent: ORANGE[500],
  accentAlt: SEMANTIC.success,
  border: GRAY[200],
} as const;

// ===========================================
// LEGACY EXPORTS (for backward compatibility)
// ===========================================

export const AVEMO = {
  orange: ORANGE[500],
  orangeLight: ORANGE[100],
  orangeHover: ORANGE[600],
  orangeFocus: ORANGE[400],
  
  black: CORE.black,
  white: CORE.white,
  
  darkBg: GRAY[900],
  darkCard: GRAY[800],
  
  grayLight: GRAY[100],
  grayMid: GRAY[600],
  grayDark: GRAY[800],
  grayMuted: GRAY[500],
  
  // Fleet blue
  blue: BLUE[500],
} as const;

// Hex colors without # for direct PptxGenJS usage
export const HEX = {
  // Orange scale
  orange500: 'ff550a',
  orange400: 'ff7932',
  orange600: 'ff3a00',
  orange100: 'ffe8d3',
  
  // Gray scale
  gray900: '221d1d',
  gray850: '2d2828',
  gray800: '433e3e',
  gray700: '625e5e',
  gray600: '767272',
  gray500: '9e9a9a',
  gray400: 'bdb9b9',
  gray300: 'e0dcdc',
  gray200: 'edebeb',
  gray100: 'f4f2f2',
  gray50: 'f9f8f8',
  
  // Core
  black: '000000',
  white: 'FFFFFF',
  
  // Blue (Fleet)
  blue500: '4BB4E6',
} as const;
