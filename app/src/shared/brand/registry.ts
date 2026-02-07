/**
 * Brand Kit Registry — Manage built-in and custom brand kits
 *
 * Provides access to all available brand kits and utilities for
 * serializing brand context for the AI system prompt.
 */

import type { BrandKit, BrandKitContext, ThemeVariant } from './types'
import { neutralBrandKit } from './presets/neutral'
import { executiveBrandKit } from './presets/executive'
import { editorialBrandKit } from './presets/editorial'
import { dashboardBrandKit } from './presets/dashboard'

// ---------------------------------------------------------------------------
// Built-in Brand Kits
// ---------------------------------------------------------------------------

/**
 * Map of all built-in brand kit presets
 */
export const BUILT_IN_BRAND_KITS: Record<string, BrandKit> = {
  neutral: neutralBrandKit,
  executive: executiveBrandKit,
  editorial: editorialBrandKit,
  dashboard: dashboardBrandKit
}

/**
 * Default brand kit ID
 */
export const DEFAULT_BRAND_KIT_ID = 'neutral'

// ---------------------------------------------------------------------------
// Brand Kit Registry
// ---------------------------------------------------------------------------

/**
 * In-memory registry of custom brand kits.
 * In a full implementation, this would be persisted to disk.
 */
const customBrandKits: Map<string, BrandKit> = new Map()

/**
 * Get a brand kit by ID (built-in or custom)
 */
export function getBrandKit(id: string): BrandKit | undefined {
  return BUILT_IN_BRAND_KITS[id] ?? customBrandKits.get(id)
}

/**
 * Get the default brand kit
 */
export function getDefaultBrandKit(): BrandKit {
  return BUILT_IN_BRAND_KITS[DEFAULT_BRAND_KIT_ID]
}

/**
 * Get all available brand kit IDs
 */
export function getAllBrandKitIds(): string[] {
  const builtIn = Object.keys(BUILT_IN_BRAND_KITS)
  const custom = Array.from(customBrandKits.keys())
  return [...builtIn, ...custom]
}

/**
 * Get metadata for all available brand kits
 */
export function getAllBrandKitMeta(): Array<{ id: string; name: string; description?: string }> {
  const all: Array<{ id: string; name: string; description?: string }> = []

  for (const [id, kit] of Object.entries(BUILT_IN_BRAND_KITS)) {
    all.push({ id, name: kit.name, description: kit.description })
  }

  for (const [id, kit] of customBrandKits) {
    all.push({ id, name: kit.name, description: kit.description })
  }

  return all
}

/**
 * Register a custom brand kit
 */
export function registerBrandKit(kit: BrandKit): void {
  if (BUILT_IN_BRAND_KITS[kit.id]) {
    throw new Error(`Cannot override built-in brand kit: ${kit.id}`)
  }
  customBrandKits.set(kit.id, kit)
}

/**
 * Remove a custom brand kit
 */
export function unregisterBrandKit(id: string): boolean {
  if (BUILT_IN_BRAND_KITS[id]) {
    throw new Error(`Cannot remove built-in brand kit: ${id}`)
  }
  return customBrandKits.delete(id)
}

// ---------------------------------------------------------------------------
// Brand Kit Context Generation
// ---------------------------------------------------------------------------

/**
 * Create a condensed context object for AI system prompt injection.
 *
 * @param kit - The brand kit to extract context from
 * @param themeName - The theme variant to use ('dark' | 'light' | custom)
 * @returns Condensed context suitable for LLM consumption
 */
export function createBrandKitContext(
  kit: BrandKit,
  themeName: 'dark' | 'light' | string = 'dark'
): BrandKitContext {
  const theme: ThemeVariant = kit.themes[themeName] ?? kit.themes.dark

  return {
    id: kit.id,
    name: kit.name,
    activeTheme: themeName,
    colors: {
      bg: theme.bg,
      bgAlt: theme.bgAlt,
      surface: theme.surface,
      text: theme.text,
      textSecondary: theme.textSecondary,
      textMuted: theme.textMuted,
      accent: theme.accent,
      accentLight: theme.accentLight,
      border: theme.border,
      primary500: kit.colors.primary[500],
      neutral900: kit.colors.neutral[900],
      neutral100: kit.colors.neutral[100]
    },
    fonts: {
      display: kit.typography.fonts.display,
      body: kit.typography.fonts.body,
      metric: kit.typography.fonts.metric ?? kit.typography.fonts.body
    },
    sizes: {
      hero: kit.typography.presets.hero.fontSize,
      h1: kit.typography.presets.h1.fontSize,
      h2: kit.typography.presets.h2.fontSize,
      body: kit.typography.presets.body.fontSize,
      caption: kit.typography.presets.caption.fontSize,
      metricLarge: kit.typography.presets.metricLarge.fontSize
    },
    cardShadow: kit.shadows.card
  }
}

/**
 * Generate a markdown-formatted brand context block for the AI system prompt.
 *
 * @param kit - The brand kit
 * @param themeName - The theme variant name
 * @returns Markdown string for prompt injection
 */
export function generateBrandPromptSection(
  kit: BrandKit,
  themeName: 'dark' | 'light' | string = 'dark'
): string {
  const ctx = createBrandKitContext(kit, themeName)
  const shadowHex = ctx.cardShadow.color

  return `## Active Brand Kit: ${ctx.name}

Use these brand specifications for all generated slides:

### Theme: ${ctx.activeTheme}

**Colors:**
- Background: \`${ctx.colors.bg}\`
- Surface/Cards: \`${ctx.colors.surface}\`
- Text: \`${ctx.colors.text}\`
- Text (secondary): \`${ctx.colors.textSecondary}\`
- Text (muted): \`${ctx.colors.textMuted}\`
- Accent: \`${ctx.colors.accent}\`
- Accent (light): \`${ctx.colors.accentLight}\`
- Border: \`${ctx.colors.border}\`

**Typography:**
- Display font: \`${ctx.fonts.display}\`
- Body font: \`${ctx.fonts.body}\`
- Metric font: \`${ctx.fonts.metric}\`

**Font sizes (pt):**
- Hero: ${ctx.sizes.hero}
- H1: ${ctx.sizes.h1}
- H2: ${ctx.sizes.h2}
- Body: ${ctx.sizes.body}
- Caption: ${ctx.sizes.caption}
- Metric Large: ${ctx.sizes.metricLarge}

**Card shadow:**
\`\`\`ts
shadow: { type: "${ctx.cardShadow.type}", blur: ${ctx.cardShadow.blur}, offset: ${ctx.cardShadow.offset}, angle: ${ctx.cardShadow.angle}, color: "${shadowHex}", opacity: ${ctx.cardShadow.opacity} }
\`\`\`

Apply these consistently across all slides for a cohesive, branded presentation.`
}

// ---------------------------------------------------------------------------
// Brand Kit Validation
// ---------------------------------------------------------------------------

/**
 * Validate a brand kit structure.
 * Returns an array of validation errors (empty if valid).
 */
export function validateBrandKit(kit: unknown): string[] {
  const errors: string[] = []

  if (!kit || typeof kit !== 'object') {
    return ['Brand kit must be an object']
  }

  const k = kit as Record<string, unknown>

  // Required top-level fields
  if (typeof k.id !== 'string' || !k.id) {
    errors.push('Brand kit must have a non-empty "id" string')
  }
  if (typeof k.name !== 'string' || !k.name) {
    errors.push('Brand kit must have a non-empty "name" string')
  }

  // Colors
  if (!k.colors || typeof k.colors !== 'object') {
    errors.push('Brand kit must have a "colors" object')
  } else {
    const colors = k.colors as Record<string, unknown>
    if (!colors.primary) errors.push('colors.primary is required')
    if (!colors.neutral) errors.push('colors.neutral is required')
    if (!colors.semantic) errors.push('colors.semantic is required')
  }

  // Typography
  if (!k.typography || typeof k.typography !== 'object') {
    errors.push('Brand kit must have a "typography" object')
  } else {
    const typo = k.typography as Record<string, unknown>
    if (!typo.fonts) errors.push('typography.fonts is required')
    if (!typo.presets) errors.push('typography.presets is required')
  }

  // Shadows
  if (!k.shadows || typeof k.shadows !== 'object') {
    errors.push('Brand kit must have a "shadows" object')
  }

  // Themes
  if (!k.themes || typeof k.themes !== 'object') {
    errors.push('Brand kit must have a "themes" object')
  } else {
    const themes = k.themes as Record<string, unknown>
    if (!themes.dark) errors.push('themes.dark is required')
    if (!themes.light) errors.push('themes.light is required')
  }

  return errors
}
