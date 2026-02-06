/**
 * Shadow Presets
 * For use with react-pptx-extended
 */

import type { ShadowProps } from 'react-pptx-extended';

export const shadows = {
  // Soft floating effect - cards that appear to hover
  float: {
    type: 'outer',
    blur: 20,
    offset: 8,
    angle: 90,
    color: '000000',
    opacity: 0.15,
  } as ShadowProps,
  
  // Strong dramatic shadow - hero elements
  dramatic: {
    type: 'outer',
    blur: 40,
    offset: 16,
    angle: 135,
    color: '000000',
    opacity: 0.4,
  } as ShadowProps,
  
  // Subtle depth - content cards
  subtle: {
    type: 'outer',
    blur: 8,
    offset: 2,
    angle: 90,
    color: '000000',
    opacity: 0.1,
  } as ShadowProps,
  
  // Medium shadow - default for most elements
  medium: {
    type: 'outer',
    blur: 16,
    offset: 6,
    angle: 135,
    color: '000000',
    opacity: 0.25,
  } as ShadowProps,
  
  // Inner shadow for inset/pressed effect
  inset: {
    type: 'inner',
    blur: 10,
    offset: 4,
    angle: 90,
    color: '000000',
    opacity: 0.2,
  } as ShadowProps,
  
  // Glow effect using shadow with brand color
  glowOrange: {
    type: 'outer',
    blur: 30,
    offset: 0,
    angle: 0,
    color: 'FF7932',
    opacity: 0.5,
  } as ShadowProps,
  
  // Glass card shadow - for glassmorphism
  glass: {
    type: 'outer',
    blur: 24,
    offset: 8,
    angle: 135,
    color: '000000',
    opacity: 0.25,
  } as ShadowProps,
  
  // Tech/Dashboard style shadow
  tech: {
    type: 'outer',
    blur: 12,
    offset: 4,
    angle: 180,
    color: '000000',
    opacity: 0.35,
  } as ShadowProps,
  
  // No shadow
  none: {
    type: 'none',
  } as ShadowProps,
} as const;
