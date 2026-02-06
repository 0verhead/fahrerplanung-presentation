/**
 * Layout System for AVEMO Presentations
 * 
 * Based on 16:9 PowerPoint standard dimensions.
 * All measurements in inches.
 */

// ===========================================
// SLIDE DIMENSIONS
// ===========================================

export const SLIDE = {
  // Standard 16:9 PowerPoint dimensions
  WIDTH: 10,           // inches
  HEIGHT: 5.625,       // inches
  
  // Safe margins (content should stay within)
  MARGIN: {
    LEFT: 0.5,
    RIGHT: 0.5,
    TOP: 0.4,
    BOTTOM: 0.4,
  },
  
  // Usable content area
  CONTENT: {
    WIDTH: 9,          // 10 - 0.5*2
    HEIGHT: 4.825,     // 5.625 - 0.4*2
    LEFT: 0.5,
    TOP: 0.4,
  },
  
  // Center points
  CENTER: {
    X: 5,
    Y: 2.8125,
  },
} as const;

// ===========================================
// 12-COLUMN GRID SYSTEM
// ===========================================

const GRID_COLUMNS = 12;
const GRID_GUTTER = 0.167; // ~0.17" gutter between columns
const GRID_COLUMN_WIDTH = (SLIDE.CONTENT.WIDTH - (GRID_GUTTER * (GRID_COLUMNS - 1))) / GRID_COLUMNS;
// Result: ~0.597" per column

export const GRID = {
  COLUMNS: GRID_COLUMNS,
  GUTTER: GRID_GUTTER,
  COLUMN_WIDTH: GRID_COLUMN_WIDTH,
  
  /**
   * Get X position for start of column N (0-indexed)
   */
  x: (col: number): number => {
    return SLIDE.MARGIN.LEFT + col * (GRID_COLUMN_WIDTH + GRID_GUTTER);
  },
  
  /**
   * Get width spanning N columns
   */
  span: (cols: number): number => {
    return cols * GRID_COLUMN_WIDTH + (cols - 1) * GRID_GUTTER;
  },
  
  /**
   * Full width (all 12 columns)
   */
  FULL_WIDTH: SLIDE.CONTENT.WIDTH,
  
  /**
   * Common column spans
   */
  SPANS: {
    HALF: (6 * GRID_COLUMN_WIDTH + 5 * GRID_GUTTER),    // 6 columns
    THIRD: (4 * GRID_COLUMN_WIDTH + 3 * GRID_GUTTER),   // 4 columns
    QUARTER: (3 * GRID_COLUMN_WIDTH + 2 * GRID_GUTTER), // 3 columns
    TWO_THIRDS: (8 * GRID_COLUMN_WIDTH + 7 * GRID_GUTTER), // 8 columns
  },
} as const;

// ===========================================
// VERTICAL RHYTHM
// ===========================================

const ROW_HEIGHT = 0.4; // Base row height in inches

export const ROWS = {
  HEIGHT: ROW_HEIGHT,
  
  /**
   * Get Y position for row N (0-indexed from content top)
   */
  y: (row: number): number => {
    return SLIDE.MARGIN.TOP + row * ROW_HEIGHT;
  },
  
  /**
   * Get height spanning N rows
   */
  span: (rows: number): number => {
    return rows * ROW_HEIGHT;
  },
} as const;

// ===========================================
// COMMON POSITIONS
// ===========================================

export const POS = {
  // Title area (top of slide)
  TITLE: {
    x: SLIDE.MARGIN.LEFT,
    y: SLIDE.MARGIN.TOP,
    w: SLIDE.CONTENT.WIDTH,
    h: 0.8,
  },
  
  // Subtitle (below title)
  SUBTITLE: {
    x: SLIDE.MARGIN.LEFT,
    y: 1.3,
    w: SLIDE.CONTENT.WIDTH * 0.7,
    h: 0.5,
  },
  
  // Main content area
  CONTENT: {
    x: SLIDE.MARGIN.LEFT,
    y: 1.6,
    w: SLIDE.CONTENT.WIDTH,
    h: 3.6,
  },
  
  // Left half (for split layouts)
  LEFT_HALF: {
    x: SLIDE.MARGIN.LEFT,
    y: SLIDE.MARGIN.TOP,
    w: GRID.SPANS.HALF - GRID.GUTTER / 2,
    h: SLIDE.CONTENT.HEIGHT,
  },
  
  // Right half (for split layouts)
  RIGHT_HALF: {
    x: SLIDE.CENTER.X + GRID.GUTTER / 2,
    y: SLIDE.MARGIN.TOP,
    w: GRID.SPANS.HALF - GRID.GUTTER / 2,
    h: SLIDE.CONTENT.HEIGHT,
  },
  
  // Footer area
  FOOTER: {
    x: SLIDE.MARGIN.LEFT,
    y: SLIDE.HEIGHT - SLIDE.MARGIN.BOTTOM - 0.3,
    w: SLIDE.CONTENT.WIDTH,
    h: 0.3,
  },
} as const;

// ===========================================
// CARD GRID HELPERS
// ===========================================

export const CARDS = {
  /**
   * Generate positions for a 2-column card grid
   */
  grid2x2: (startY: number, cardHeight: number, gap: number = 0.2) => [
    { x: GRID.x(0), y: startY, w: GRID.SPANS.HALF - gap/2, h: cardHeight },
    { x: GRID.x(6) + gap/2, y: startY, w: GRID.SPANS.HALF - gap/2, h: cardHeight },
    { x: GRID.x(0), y: startY + cardHeight + gap, w: GRID.SPANS.HALF - gap/2, h: cardHeight },
    { x: GRID.x(6) + gap/2, y: startY + cardHeight + gap, w: GRID.SPANS.HALF - gap/2, h: cardHeight },
  ],
  
  /**
   * Generate positions for a 3-column card grid
   */
  grid3x2: (startY: number, cardHeight: number, gap: number = 0.2) => {
    const cardWidth = (SLIDE.CONTENT.WIDTH - gap * 2) / 3;
    return [
      { x: SLIDE.MARGIN.LEFT, y: startY, w: cardWidth, h: cardHeight },
      { x: SLIDE.MARGIN.LEFT + cardWidth + gap, y: startY, w: cardWidth, h: cardHeight },
      { x: SLIDE.MARGIN.LEFT + (cardWidth + gap) * 2, y: startY, w: cardWidth, h: cardHeight },
      { x: SLIDE.MARGIN.LEFT, y: startY + cardHeight + gap, w: cardWidth, h: cardHeight },
      { x: SLIDE.MARGIN.LEFT + cardWidth + gap, y: startY + cardHeight + gap, w: cardWidth, h: cardHeight },
      { x: SLIDE.MARGIN.LEFT + (cardWidth + gap) * 2, y: startY + cardHeight + gap, w: cardWidth, h: cardHeight },
    ];
  },
  
  /**
   * Generate positions for a horizontal row of N cards
   */
  row: (n: number, startY: number, cardHeight: number, gap: number = 0.2) => {
    const cardWidth = (SLIDE.CONTENT.WIDTH - gap * (n - 1)) / n;
    return Array.from({ length: n }, (_, i) => ({
      x: SLIDE.MARGIN.LEFT + i * (cardWidth + gap),
      y: startY,
      w: cardWidth,
      h: cardHeight,
    }));
  },
} as const;

// ===========================================
// SPACING SCALE
// ===========================================

export const SPACING = {
  XXS: 0.1,
  XS: 0.15,
  S: 0.2,
  M: 0.3,
  L: 0.4,
  XL: 0.6,
  XXL: 0.8,
  XXXL: 1.0,
} as const;

// ===========================================
// BORDER RADIUS SCALE (for roundRect)
// ===========================================

export const RADIUS = {
  NONE: 0,
  XS: 0.05,
  S: 0.08,
  M: 0.12,
  L: 0.2,
  XL: 0.3,
  PILL: 0.5,
} as const;
