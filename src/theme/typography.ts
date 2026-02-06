/**
 * Typography Presets
 * Consistent text styling across presentations
 */

export const typography = {
  // Massive hero text
  hero: {
    fontSize: 72,
    bold: true,
    fontFace: 'Arial Black',
  },
  
  // Extra large display
  display: {
    fontSize: 96,
    bold: true,
    fontFace: 'Arial Black',
  },
  
  // Main title
  title: {
    fontSize: 44,
    bold: true,
    fontFace: 'Arial',
  },
  
  // Section heading
  heading: {
    fontSize: 32,
    bold: true,
    fontFace: 'Arial',
  },
  
  // Subtitle
  subtitle: {
    fontSize: 24,
    fontFace: 'Arial',
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontFace: 'Arial',
    lineSpacing: 24,
  },
  
  // Large body text
  bodyLarge: {
    fontSize: 20,
    fontFace: 'Arial',
    lineSpacing: 28,
  },
  
  // Small label text
  label: {
    fontSize: 12,
    bold: true,
    fontFace: 'Arial',
  },
  
  // Section label (uppercase style)
  sectionLabel: {
    fontSize: 14,
    bold: true,
    fontFace: 'Arial',
  },
  
  // Large statistic number
  stat: {
    fontSize: 64,
    bold: true,
    fontFace: 'Arial Black',
  },
  
  // Extra large statistic
  statLarge: {
    fontSize: 96,
    bold: true,
    fontFace: 'Arial Black',
  },
  
  // Caption text
  caption: {
    fontSize: 11,
    fontFace: 'Arial',
  },
  
  // Card title
  cardTitle: {
    fontSize: 18,
    bold: true,
    fontFace: 'Arial',
  },
  
  // Card description
  cardDescription: {
    fontSize: 13,
    fontFace: 'Arial',
  },
  
  // Feature number
  featureNumber: {
    fontSize: 28,
    bold: true,
    fontFace: 'Arial Black',
  },
} as const;
