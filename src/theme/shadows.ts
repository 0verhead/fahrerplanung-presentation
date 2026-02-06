/**
 * Shadow Presets for AVEMO Presentations
 * 
 * Based on Apple/Figma design principles:
 * - Shadows should be subtle and functional
 * - Used to create hierarchy, not decoration
 * - Less is more - avoid heavy drop shadows
 */

import type { ShadowProps } from 'react-pptx-extended';

// ===========================================
// SHADOW PRESETS
// ===========================================

export const shadows = {
  /**
   * None - no shadow
   */
  none: {
    type: 'none',
  } as ShadowProps,
  
  /**
   * Subtle - barely visible, for cards on same-color background
   * Use: content cards on white, data cards
   */
  subtle: {
    type: 'outer',
    blur: 6,
    offset: 2,
    angle: 90,
    color: '#000000',
    opacity: 0.08,
  } as ShadowProps,
  
  /**
   * Soft - light elevation for cards
   * Use: feature cards, info boxes
   */
  soft: {
    type: 'outer',
    blur: 12,
    offset: 4,
    angle: 90,
    color: '#000000',
    opacity: 0.1,
  } as ShadowProps,
  
  /**
   * Medium - clear elevation
   * Use: modal-like elements, highlighted content
   */
  medium: {
    type: 'outer',
    blur: 16,
    offset: 6,
    angle: 135,
    color: '#000000',
    opacity: 0.12,
  } as ShadowProps,
  
  /**
   * Strong - prominent elevation (use sparingly)
   * Use: hero elements, primary CTA cards
   */
  strong: {
    type: 'outer',
    blur: 24,
    offset: 8,
    angle: 135,
    color: '#000000',
    opacity: 0.15,
  } as ShadowProps,
  
  /**
   * Inner subtle - inset effect
   * Use: input fields, pressed states
   */
  inner: {
    type: 'inner',
    blur: 4,
    offset: 2,
    angle: 90,
    color: '#000000',
    opacity: 0.06,
  } as ShadowProps,
  
  // ===========================================
  // THEME-SPECIFIC SHADOWS
  // ===========================================
  
  /**
   * Dark mode card shadow
   * Lighter shadows work better on dark backgrounds
   */
  darkCard: {
    type: 'outer',
    blur: 8,
    offset: 2,
    angle: 180,
    color: '#000000',
    opacity: 0.3,
  } as ShadowProps,
  
  /**
   * Light card with subtle lift
   */
  lightCard: {
    type: 'outer',
    blur: 10,
    offset: 3,
    angle: 90,
    color: '#000000',
    opacity: 0.06,
  } as ShadowProps,
  
  /**
   * Data card shadow - minimal but visible
   */
  dataCard: {
    type: 'outer',
    blur: 8,
    offset: 2,
    angle: 90,
    color: '#000000',
    opacity: 0.05,
  } as ShadowProps,
} as const;

// ===========================================
// LEGACY EXPORTS (for backward compatibility)
// ===========================================

export const {
  subtle,
  soft,
  medium,
  strong,
  inner,
  darkCard,
  lightCard,
  dataCard,
} = shadows;
