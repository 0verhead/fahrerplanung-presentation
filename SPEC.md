# Fahrersoftware Presentation Generator - Technical Specification

## Overview

Generate 5 sophisticated, distinct PowerPoint presentations for AVEMO Group's "Fahrersoftware" (driver software) using a forked and extended version of react-pptx with full shadow, rotation, and effects support.

## Architecture

### Project Structure

```
/root/fahrerplanung/
├── packages/
│   └── react-pptx-extended/        # Forked react-pptx with extended features
│       ├── src/
│       │   ├── nodes.ts            # Extended types (shadow, rotate, glow, etc.)
│       │   ├── normalizer.ts       # Process extended props
│       │   ├── renderer.ts         # Pass to PptxGenJS
│       │   ├── util.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── src/
│   ├── theme/
│   │   ├── colors.ts               # AVEMO brand colors
│   │   ├── shadows.ts              # Preset shadow styles
│   │   ├── typography.ts           # Font presets
│   │   └── index.ts
│   │
│   ├── components/
│   │   ├── GlassCard.tsx           # Glassmorphism card
│   │   ├── GradientBg.tsx          # SVG gradient generator
│   │   ├── GlowShape.tsx           # Shape with glow effect
│   │   ├── StatBlock.tsx           # Metric display
│   │   ├── FeatureCard.tsx         # MVP feature card
│   │   ├── SectionTitle.tsx        # Consistent headings
│   │   ├── AccentLine.tsx          # Decorative lines
│   │   └── index.ts
│   │
│   ├── layouts/
│   │   ├── TitleSlide.tsx          # Reusable title layout
│   │   ├── SplitSlide.tsx          # Left/right split
│   │   ├── GridSlide.tsx           # Card grid layout
│   │   └── index.ts
│   │
│   ├── designs/
│   │   ├── cinematic/              # Design 1: Cinematic Dark
│   │   ├── minimal/                # Design 2: Minimal Glass
│   │   ├── editorial/              # Design 3: Bold Editorial
│   │   ├── asymmetric/             # Design 4: Asymmetric Modern
│   │   └── dashboard/              # Design 5: Dashboard Tech
│   │
│   ├── utils/
│   │   ├── gradient.ts             # SVG gradient generator
│   │   └── helpers.ts
│   │
│   └── index.ts                    # CLI entry point
│
├── output/                         # Generated .pptx files
├── package.json                    # Workspace root
├── tsconfig.json
├── SPEC.md                         # This file
└── .gitignore
```

## react-pptx-extended Features

### Extended from original react-pptx

The fork adds the following features not available in the original:

#### 1. Shadow Support (Shapes, Text, Images)

```typescript
type ShadowProps = {
  type?: 'outer' | 'inner' | 'none';
  blur?: number;      // points
  offset?: number;    // points
  angle?: number;     // degrees (0-360)
  color?: string;     // hex color
  opacity?: number;   // 0-1
};
```

#### 2. Glow Support

```typescript
type GlowProps = {
  size?: number;      // points
  color?: string;     // hex color
  opacity?: number;   // 0-1
};
```

#### 3. Rotation

```typescript
rotate?: number;  // 0-360 degrees
```

#### 4. Corner Radius Control

```typescript
rectRadius?: number;  // inches, for rounded rectangles
```

#### 5. Border Dash Styles

```typescript
borderDash?: 'solid' | 'dash' | 'dashDot' | 'lgDash' | 'lgDashDot' | 'lgDashDotDot' | 'sysDash' | 'sysDot';
```

#### 6. Image Extensions

```typescript
// Image style additions
style?: {
  shadow?: ShadowProps;
  rotate?: number;
  rounding?: boolean;      // rounded corners
  transparency?: number;   // 0-100
};
```

#### 7. Flip Support

```typescript
flipH?: boolean;
flipV?: boolean;
```

### Files Modified

| File | Changes |
|------|---------|
| `nodes.ts` | Add ShadowProps, GlowProps types; extend ShapeProps, TextProps, ImageProps |
| `normalizer.ts` | Add InternalShadow, InternalGlow; process new props in normalizeSlideObject |
| `renderer.ts` | Pass shadow, glow, rotate, rectRadius, etc. to PptxGenJS |

## AVEMO Brand Guidelines

### Colors

```typescript
export const AVEMO = {
  // Primary
  orange: '#FF7932',        // Brand accent color
  
  // Neutrals
  black: '#1A1A1A',
  darkBg: '#0D0D0D',
  white: '#FFFFFF',
  
  // Grays
  grayLight: '#F5F5F5',
  grayMid: '#666666',
  grayDark: '#333333',
  
  // Extended
  orangeLight: 'rgba(255, 121, 50, 0.3)',
  orangeGlow: 'rgba(255, 121, 50, 0.5)',
};
```

### Shadow Presets

```typescript
export const shadows = {
  // Soft floating effect
  float: { type: 'outer', blur: 20, offset: 8, angle: 90, opacity: 0.15 },
  
  // Strong dramatic shadow
  dramatic: { type: 'outer', blur: 40, offset: 16, angle: 135, opacity: 0.4 },
  
  // Subtle depth
  subtle: { type: 'outer', blur: 8, offset: 2, angle: 90, opacity: 0.1 },
  
  // Inner shadow for depth
  inset: { type: 'inner', blur: 10, offset: 4, angle: 90, opacity: 0.2 },
  
  // Glow effect (shadow with brand color)
  glowOrange: { type: 'outer', blur: 30, offset: 0, angle: 0, color: '#FF7932', opacity: 0.5 },
  
  // Glass card shadow
  glass: { type: 'outer', blur: 24, offset: 8, angle: 135, color: '000000', opacity: 0.25 },
};
```

### Typography Presets

```typescript
export const typography = {
  hero: { fontSize: 72, bold: true, fontFace: 'Arial Black' },
  title: { fontSize: 44, bold: true, fontFace: 'Arial' },
  subtitle: { fontSize: 24, fontFace: 'Arial' },
  body: { fontSize: 16, lineSpacing: 24, fontFace: 'Arial' },
  label: { fontSize: 12, bold: true, fontFace: 'Arial' },
  stat: { fontSize: 64, bold: true, fontFace: 'Arial Black' },
  caption: { fontSize: 11, fontFace: 'Arial' },
};
```

## 5 Presentation Designs

### Design 1: Cinematic Dark

**Theme:** Dark, dramatic, cinematic feel with orange glows

**Characteristics:**
- Deep black backgrounds (#0D0D0D)
- Large orange glow effects behind key elements
- Glassmorphism cards with strong shadows
- Massive, dramatic typography
- Diagonal accent shapes
- High contrast text

**Slide Structure:**
1. Title: Full-bleed dark with orange glow, massive "FAHRERSOFTWARE" text
2. Problem: Split layout, glass cards listing challenges, large stat callout
3. Solution: Diagonal orange accent, benefit cards with orange accent bars
4. MVP: Grid of 6 glass cards with numbered features
5. Closing: Orange glow circle, CTA text

### Design 2: Minimal Glass

**Theme:** Clean, white, floating glass panels

**Characteristics:**
- White/light gray backgrounds
- Floating glass cards with subtle shadows
- Swiss typography style (clean, hierarchical)
- Orange used sparingly as sharp accent
- Generous whitespace
- Soft, subtle depth

**Slide Structure:**
1. Title: Large glass card floating on gray, orange dot accent
2. Problem: Numbered list with glass card rows
3. Solution: Large orange sidebar, icon circles
4. MVP: Grid cards with orange top accent bars
5. Closing: Scattered orange dots, clean typography

### Design 3: Bold Editorial

**Theme:** Magazine-style, high contrast, typographic

**Characteristics:**
- Pure black and white with orange blocks
- Massive typography as design element
- Geometric orange shapes
- Editorial magazine layout
- Strong grid structure
- Minimal shadows (contrast does the work)

**Slide Structure:**
1. Title: Stacked "FAHRER" / "SOFTWARE" with orange block
2. Problem: Orange left panel with huge "01", content right
3. Solution: White card floating on black, compact info
4. MVP: Large "MVP" watermark, numbered features
5. Closing: Diagonal orange stripe, bold CTA

### Design 4: Asymmetric Modern

**Theme:** Contemporary web aesthetic, unbalanced layouts

**Characteristics:**
- Asymmetric, unbalanced compositions
- Rounded corners everywhere
- Soft gradients (approximated)
- Floating elements at unusual positions
- Orange as shape color, not just accent
- Modern, fresh feel

**Slide Structure:**
1. Title: Asymmetric orange shape covering right half
2. Problem: Orange header bar, scattered rounded cards
3. Solution: Large rounded main card, orange icon circles
4. MVP: Pill-shaped feature cards in staggered layout
5. Closing: Split horizontal (black/orange)

### Design 5: Dashboard Tech

**Theme:** Dark tech UI, data visualization aesthetic

**Characteristics:**
- Very dark blue-black background (#0A0E17)
- Grid pattern overlay
- Data card styling (headers, values, labels)
- Status indicators and badges
- Neon orange accents
- Tech/dashboard feel

**Slide Structure:**
1. Title: Grid lines, main card with orange accent bar, bottom stats row
2. Problem: "SYSTEM STATUS" header, metric cards with status indicators
3. Solution: Checklist style, side panel with projected metrics
4. MVP: Module cards with code labels (ALGORITHM, MOBILE, etc.)
5. Closing: Centered card with animated-border effect

## Gradient SVG Utility

Since PptxGenJS doesn't support native gradients, we generate SVG gradients as base64 images.

```typescript
// Linear gradient
function createLinearGradientSvg(options: {
  width: number;
  height: number;
  angle: number;
  stops: Array<{ color: string; position: number }>;
}): string;

// Radial gradient
function createRadialGradientSvg(options: {
  width: number;
  height: number;
  centerX: number;  // percentage
  centerY: number;  // percentage
  stops: Array<{ color: string; position: number }>;
}): string;
```

**Usage:**
```tsx
<Slide style={{
  backgroundImage: {
    kind: 'data',
    data: createRadialGradientSvg({
      width: 1920,
      height: 1080,
      centerX: 80,
      centerY: 20,
      stops: [
        { color: '#FF7932', position: 0 },
        { color: '#0D0D0D', position: 70 },
      ]
    })
  }
}}>
```

## Presentation Content

### Slide 1: Title
- "Fahrersoftware"
- "Die Zukunft der Fahrzeugdisposition"
- "Eine Software für alle Standorte"

### Slide 2: Problem (Aktuelle Herausforderungen)
- Isolierte Standorte - Keine Vernetzung zwischen den Niederlassungen
- Manuelle Prozesse - Excel, Outlook & Kalender führen zu Chaos
- Fehlende Daten - Keine KPIs, keine Optimierung möglich
- Hohe Leerlaufzeit - 2,5 Stunden täglich pro Fahrzeug
- Lange Wartezeit - 30 Tage durchschnittlich auf Fahrzeuge

### Slide 3: Solution (Die Lösung)
- Synergien nutzen - Vernetzung aller Standorte
- Effizienz steigern - Optimierte Fahrzeugnutzung
- Automatisierung - Weniger manuelle Arbeit
- Kosteneinsparung - Potenzial von 260.000 € pro Jahr

### Slide 4: MVP Features (Minimum Viable Product)
1. Planungsalgorithmus - Optimierte Tourenplanung
2. Driver App - Intuitive Bedienung
3. Web-Backoffice - Moderne Oberfläche
4. Externe Dienstleister - Integration
5. Monitoring - Echtzeit-Übersicht
6. Reporting - Automatisierte Reports

### Slide 5: Closing
- "Bereit für die Zukunft?"
- "Gemeinsam gestalten wir die digitale Transformation Ihrer Fahrzeugdisposition."

## Build & Generate

```bash
# Install dependencies
npm install

# Build react-pptx-extended
npm run build -w react-pptx-extended

# Generate presentations
npm run generate

# Output files
output/
├── design-1-cinematic-dark.pptx
├── design-2-minimal-glass.pptx
├── design-3-bold-editorial.pptx
├── design-4-asymmetric-modern.pptx
└── design-5-dashboard-tech.pptx
```

## Dependencies

### Root
- tsx (TypeScript execution)
- typescript

### react-pptx-extended
- pptxgenjs ^3.12.0
- color ^4.2.3
- cross-fetch ^4.0.0
- react (peer)

## Notes

- All presentations are 16:9 (1920x1080 logical)
- Text remains editable in PowerPoint
- Shapes remain editable (can change colors, resize)
- Gradient backgrounds are images (not editable as gradients)
- Shadows and effects are native PowerPoint effects (editable)
