/**
 * Brand Kit System — Barrel exports
 *
 * Exports all brand-related types, presets, and utilities.
 */

// Types
export type {
  ColorScale,
  SemanticColors,
  BrandColors,
  BrandFonts,
  TypographyPreset,
  BrandTypography,
  ShadowPreset,
  BrandShadows,
  ThemeVariant,
  BrandKit,
  BrandKitContext
} from './types'

// Presets
export { neutralBrandKit } from './presets/neutral'
export { executiveBrandKit } from './presets/executive'
export { editorialBrandKit } from './presets/editorial'
export { dashboardBrandKit } from './presets/dashboard'

// Registry
export {
  BUILT_IN_BRAND_KITS,
  DEFAULT_BRAND_KIT_ID,
  getBrandKit,
  getDefaultBrandKit,
  getAllBrandKitIds,
  getAllBrandKitMeta,
  registerBrandKit,
  unregisterBrandKit,
  createBrandKitContext,
  generateBrandPromptSection,
  validateBrandKit
} from './registry'
