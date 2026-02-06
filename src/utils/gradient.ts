/**
 * SVG Gradient Generator
 * Creates SVG gradients as base64 data URLs for use as slide backgrounds
 */

export interface GradientStop {
  color: string;  // hex color with or without #
  position: number;  // 0-100 percentage
}

export interface LinearGradientOptions {
  width: number;
  height: number;
  angle: number;  // degrees
  stops: GradientStop[];
}

export interface RadialGradientOptions {
  width: number;
  height: number;
  centerX: number;  // percentage 0-100
  centerY: number;  // percentage 0-100
  stops: GradientStop[];
}

/**
 * Normalize hex color to proper format
 */
const normalizeColor = (color: string): string => {
  if (color.startsWith('#')) return color;
  return `#${color}`;
};

/**
 * Convert angle to SVG gradient coordinates
 * Angle 0 = bottom to top, 90 = left to right, etc.
 */
const angleToCoordinates = (angle: number): { x1: string; y1: string; x2: string; y2: string } => {
  const rad = (angle - 90) * (Math.PI / 180);
  const x1 = Math.round(50 - Math.cos(rad) * 50);
  const y1 = Math.round(50 + Math.sin(rad) * 50);
  const x2 = Math.round(50 + Math.cos(rad) * 50);
  const y2 = Math.round(50 - Math.sin(rad) * 50);
  
  return {
    x1: `${x1}%`,
    y1: `${y1}%`,
    x2: `${x2}%`,
    y2: `${y2}%`,
  };
};

/**
 * Create a linear gradient SVG as a base64 data URL
 */
export function createLinearGradientSvg(options: LinearGradientOptions): string {
  const { width, height, angle, stops } = options;
  const coords = angleToCoordinates(angle);
  
  const stopsXml = stops
    .map(stop => `<stop offset="${stop.position}%" stop-color="${normalizeColor(stop.color)}"/>`)
    .join('\n      ');
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="grad" x1="${coords.x1}" y1="${coords.y1}" x2="${coords.x2}" y2="${coords.y2}">
      ${stopsXml}
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
</svg>`;

  const base64 = Buffer.from(svg).toString('base64');
  return `image/svg+xml;base64,${base64}`;
}

/**
 * Create a radial gradient SVG as a base64 data URL
 */
export function createRadialGradientSvg(options: RadialGradientOptions): string {
  const { width, height, centerX, centerY, stops } = options;
  
  const stopsXml = stops
    .map(stop => `<stop offset="${stop.position}%" stop-color="${normalizeColor(stop.color)}"/>`)
    .join('\n      ');
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="grad" cx="${centerX}%" cy="${centerY}%" r="100%" fx="${centerX}%" fy="${centerY}%">
      ${stopsXml}
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
</svg>`;

  const base64 = Buffer.from(svg).toString('base64');
  return `image/svg+xml;base64,${base64}`;
}

/**
 * Pre-built gradient backgrounds for common use cases
 */
export const gradients = {
  // Dark with orange glow in corner
  cinematicDark: () => createRadialGradientSvg({
    width: 1920,
    height: 1080,
    centerX: 85,
    centerY: 15,
    stops: [
      { color: 'FF7932', position: 0 },
      { color: '1A1A1A', position: 40 },
      { color: '0D0D0D', position: 100 },
    ],
  }),
  
  // Subtle dark gradient
  darkSubtle: () => createLinearGradientSvg({
    width: 1920,
    height: 1080,
    angle: 135,
    stops: [
      { color: '1A1A1A', position: 0 },
      { color: '0D0D0D', position: 100 },
    ],
  }),
  
  // Light gradient for minimal style
  lightSubtle: () => createLinearGradientSvg({
    width: 1920,
    height: 1080,
    angle: 180,
    stops: [
      { color: 'FFFFFF', position: 0 },
      { color: 'F5F5F5', position: 100 },
    ],
  }),
  
  // Orange to dark for accents
  orangeToDark: () => createLinearGradientSvg({
    width: 1920,
    height: 1080,
    angle: 135,
    stops: [
      { color: 'FF7932', position: 0 },
      { color: '0D0D0D', position: 100 },
    ],
  }),
  
  // Dashboard tech gradient
  dashboardDark: () => createLinearGradientSvg({
    width: 1920,
    height: 1080,
    angle: 180,
    stops: [
      { color: '0A0E17', position: 0 },
      { color: '111827', position: 100 },
    ],
  }),
};
