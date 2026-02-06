/**
 * Typography System for AVEMO Presentations
 * 
 * Font choices based on PowerPoint compatibility testing:
 * - Century Gothic: Geometric sans-serif, matches AVEMO's custom font character
 * - Segoe UI: Microsoft's modern system font, excellent readability
 * - Calibri: Universal Office font, good for body text
 * 
 * These fonts are included with Windows and render reliably in PowerPoint.
 */

// ===========================================
// FONT FAMILIES
// ===========================================

export const FONTS = {
  // Primary display font - geometric, matches AVEMO style
  DISPLAY: 'Century Gothic',
  
  // Body font - clean, modern, highly readable
  BODY: 'Segoe UI',
  
  // Numbers/metrics - elegant, light weight
  METRIC: 'Calibri Light',
  
  // Fallbacks
  FALLBACK_DISPLAY: 'Calibri',
  FALLBACK_BODY: 'Arial',
} as const;

// ===========================================
// TYPE SCALE
// ===========================================

/**
 * Typography presets for consistent text styling.
 * All sizes in points (pt).
 */
export const typography = {
  // ===========================================
  // DISPLAY / HEROES
  // ===========================================
  
  /**
   * Hero headline - use once per presentation max
   * Example: "Fahrersoftware"
   */
  hero: {
    fontSize: 54,
    bold: true,
    fontFace: FONTS.DISPLAY,
  },
  
  /**
   * Large display - section openers
   * Example: "Zukunft?"
   */
  display: {
    fontSize: 44,
    bold: true,
    fontFace: FONTS.DISPLAY,
  },
  
  // ===========================================
  // HEADINGS
  // ===========================================
  
  /**
   * H1 - Slide title
   * Example: "Die aktuelle Situation"
   */
  h1: {
    fontSize: 32,
    bold: true,
    fontFace: FONTS.DISPLAY,
  },
  
  /**
   * H2 - Section header
   * Example: "Das Problem"
   */
  h2: {
    fontSize: 24,
    bold: true,
    fontFace: FONTS.DISPLAY,
  },
  
  /**
   * H3 - Card title / subsection
   * Example: "Isolierte Standorte"
   */
  h3: {
    fontSize: 18,
    bold: true,
    fontFace: FONTS.BODY,
  },
  
  /**
   * H4 - Small heading
   */
  h4: {
    fontSize: 14,
    bold: true,
    fontFace: FONTS.BODY,
  },
  
  // ===========================================
  // BODY TEXT
  // ===========================================
  
  /**
   * Lead paragraph - intro text
   */
  lead: {
    fontSize: 18,
    fontFace: FONTS.BODY,
    lineSpacing: 26,
  },
  
  /**
   * Body - main content text
   */
  body: {
    fontSize: 14,
    fontFace: FONTS.BODY,
    lineSpacing: 20,
  },
  
  /**
   * Body small - secondary content
   */
  bodySmall: {
    fontSize: 12,
    fontFace: FONTS.BODY,
    lineSpacing: 18,
  },
  
  // ===========================================
  // LABELS & CAPTIONS
  // ===========================================
  
  /**
   * Label - section markers, categories
   * Example: "DAS PROBLEM"
   */
  label: {
    fontSize: 11,
    bold: true,
    fontFace: FONTS.BODY,
  },
  
  /**
   * Caption - supporting text, footnotes
   */
  caption: {
    fontSize: 10,
    fontFace: FONTS.BODY,
  },
  
  /**
   * Overline - small uppercase labels
   * Example: "MINIMUM VIABLE PRODUCT"
   */
  overline: {
    fontSize: 10,
    bold: true,
    fontFace: FONTS.BODY,
  },
  
  // ===========================================
  // DATA / METRICS
  // ===========================================
  
  /**
   * Metric large - hero numbers
   * Example: "260.000"
   */
  metricLarge: {
    fontSize: 72,
    bold: true,
    fontFace: FONTS.METRIC,
  },
  
  /**
   * Metric - standard data points
   * Example: "30"
   */
  metric: {
    fontSize: 48,
    bold: true,
    fontFace: FONTS.METRIC,
  },
  
  /**
   * Metric small - card metrics
   * Example: "2,5h"
   */
  metricSmall: {
    fontSize: 32,
    bold: true,
    fontFace: FONTS.METRIC,
  },
  
  /**
   * Metric unit - units and labels for metrics
   * Example: "Tage"
   */
  metricUnit: {
    fontSize: 18,
    fontFace: FONTS.BODY,
  },
  
  // ===========================================
  // CARDS & UI
  // ===========================================
  
  /**
   * Card title
   */
  cardTitle: {
    fontSize: 16,
    bold: true,
    fontFace: FONTS.BODY,
  },
  
  /**
   * Card body
   */
  cardBody: {
    fontSize: 12,
    fontFace: FONTS.BODY,
    lineSpacing: 16,
  },
  
  /**
   * Feature number - numbered lists
   * Example: "01"
   */
  featureNum: {
    fontSize: 20,
    bold: true,
    fontFace: FONTS.DISPLAY,
  },
  
  // ===========================================
  // QUOTES & CALLOUTS
  // ===========================================
  
  /**
   * Quote - testimonials, callouts
   */
  quote: {
    fontSize: 20,
    italic: true,
    fontFace: FONTS.BODY,
    lineSpacing: 28,
  },
  
  /**
   * CTA - call to action text
   */
  cta: {
    fontSize: 16,
    bold: true,
    fontFace: FONTS.BODY,
  },
} as const;

// ===========================================
// HELPER TYPES
// ===========================================

export type TypographyStyle = typeof typography[keyof typeof typography];
