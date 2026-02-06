import type PptxGenJs from "pptxgenjs";
import React from "react";
import {
  InternalImageSrc,
  InternalPresentation,
  InternalText,
  InternalTextPart,
  InternalTextPartBaseStyle,
} from "./normalizer";
import { ChildElement } from "./util";

export enum NodeTypes {
  SHAPE = "shape",
  LINE = "line",
  TEXT_LINK = "text-link",
  TEXT_BULLET = "text-bullet",
  SLIDE = "slide",
  MASTER_SLIDE = "master-slide",
  IMAGE = "image",
  TABLE_CELL = "table-cell",
  PRESENTATION = "presentation",
}

// ============================================
// EXTENDED TYPES - Shadow, Glow, Effects
// ============================================

/**
 * Shadow properties for shapes, text, and images
 */
export type ShadowProps = {
  type?: 'outer' | 'inner' | 'none';
  blur?: number;      // points
  offset?: number;    // points
  angle?: number;     // degrees (0-360)
  color?: string;     // hex color (without #) or with #
  opacity?: number;   // 0-1
};

/**
 * Glow effect properties
 */
export type GlowProps = {
  size?: number;      // points
  color?: string;     // hex color
  opacity?: number;   // 0-1
};

/**
 * Border dash styles
 */
export type BorderDashStyle = 
  | 'solid' 
  | 'dash' 
  | 'dashDot' 
  | 'lgDash' 
  | 'lgDashDot' 
  | 'lgDashDotDot' 
  | 'sysDash' 
  | 'sysDot';

// ============================================
// BASE TYPES
// ============================================

type VisualBaseProps = {
  style?: {
    x: number | string;
    y: number | string;
    w: number | string;
    h: number | string;
  };
};

interface TextNodeBaseStyle extends Omit<InternalTextPartBaseStyle, "color"> {
  color?: string;
}
type TextNodeBaseProps = Pick<InternalTextPart, "rtlMode" | "lang">;

// ============================================
// TEXT LINK
// ============================================

export type TextLinkProps = TextNodeBaseProps & {
  children: string;
  tooltip?: string;
  style?: TextNodeBaseStyle;
} & (
    | {
        url: string;
      }
    | {
        slide: number;
      }
  );

const TextLink: React.FC<TextLinkProps> =
  NodeTypes.TEXT_LINK as unknown as React.FC;
export const isTextLink = (
  el: React.ReactElement
): el is React.ReactElement<TextLinkProps> => {
  return el.type === NodeTypes.TEXT_LINK;
};

// ============================================
// TEXT BULLET
// ============================================

export type TextBulletProps = TextNodeBaseProps & {
  children: TextChild;
  style?: TextNodeBaseStyle;
} & Omit<
    Exclude<PptxGenJs.TextBaseProps["bullet"], boolean | undefined>,
    "style"
  >;
const TextBullet: React.FC<TextBulletProps> =
  NodeTypes.TEXT_BULLET as unknown as React.FC;
export const isTextBullet = (
  el: React.ReactElement
): el is React.ReactElement<TextBulletProps> => {
  return el.type === NodeTypes.TEXT_BULLET;
};

export type TextChild =
  | string
  | number
  | ChildElement<TextLinkProps>
  | ChildElement<TextBulletProps>
  | TextChild[];

// ============================================
// TEXT (Extended with shadow)
// ============================================

export type TextProps = TextNodeBaseProps & {
  children?: TextChild;
  style?: Partial<Exclude<VisualBaseProps["style"], undefined>> &
    TextNodeBaseStyle & {
      align?: InternalText["style"]["align"];
      verticalAlign?: InternalText["style"]["verticalAlign"];
      // EXTENDED: Shadow support for text
      shadow?: ShadowProps;
      // EXTENDED: Rotation
      rotate?: number;
    };
};
function TextFn(_props: TextProps): React.ReactElement | null { return null; }
(TextFn as any).isPptxTextElement = true;
(TextFn as any).Link = TextLink;
(TextFn as any).Bullet = TextBullet;
export const Text = Object.assign(TextFn, {
  Link: TextLink,
  Bullet: TextBullet,
});

// We add a random symbol-ish for use in isText
// For some reason a normal el.type == Text doesn't work here when
// the result is bundled
(Text as any).isPptxTextElement = true;
export const isText = (
  el: React.ReactElement
): el is React.FunctionComponentElement<TextProps> => {
  return el.type instanceof Function && (el.type as any).isPptxTextElement;
};

// ============================================
// IMAGE (Extended with shadow, rotate, transparency)
// ============================================

export type ImageProps = VisualBaseProps & {
  src: InternalImageSrc | string;
  style?: {
    /**
     * @deprecated no longer has any effect and will be removed soon! Use sizing.fit instead
     */
    backgroundSize?: "contain" | "cover";

    sizing?: {
      fit: "contain" | "cover" | "crop";
      imageWidth?: number;
      imageHeight?: number;
    };
    
    // EXTENDED: Shadow
    shadow?: ShadowProps;
    // EXTENDED: Rotation (degrees 0-360)
    rotate?: number;
    // EXTENDED: Rounded corners
    rounding?: boolean;
    // EXTENDED: Transparency (0-100, where 0 is opaque)
    transparency?: number;
  };
};
export const Image: React.FC<ImageProps> =
  NodeTypes.IMAGE as unknown as React.FC;
export const isImage = (
  el: React.ReactElement
): el is React.ReactElement<ImageProps> => {
  return el.type === NodeTypes.IMAGE;
};

// ============================================
// SHAPE (Extended with shadow, glow, rotate, rectRadius)
// ============================================

export type ShapeProps = VisualBaseProps & {
  type: keyof typeof PptxGenJs.ShapeType;
  children?: TextChild;
  style?: {
    backgroundColor?: string;
    borderWidth?: number;
    borderColor?: string;
    
    // EXTENDED: Shadow
    shadow?: ShadowProps;
    // EXTENDED: Glow effect
    glow?: GlowProps;
    // EXTENDED: Rotation (degrees 0-360)
    rotate?: number;
    // EXTENDED: Corner radius for rounded rectangles (inches)
    rectRadius?: number;
    // EXTENDED: Border dash style
    borderDash?: BorderDashStyle;
    // EXTENDED: Flip horizontal
    flipH?: boolean;
    // EXTENDED: Flip vertical
    flipV?: boolean;
  };
};
export const Shape: React.FC<ShapeProps> =
  NodeTypes.SHAPE as unknown as React.FC;
export const isShape = (
  el: React.ReactElement
): el is React.ReactElement<ShapeProps> => {
  return el.type === NodeTypes.SHAPE;
};

// ============================================
// TABLE CELL
// ============================================

export type TableCellProps = TextProps & {
  colSpan?: number;
  rowSpan?: number;
};
export const TableCell: React.FC<TableCellProps> =
  NodeTypes.TABLE_CELL as unknown as React.FC;
export const isTableCell = (
  el: React.ReactElement
): el is React.ReactElement<TableCellProps> => {
  return el.type === NodeTypes.TABLE_CELL;
};

// ============================================
// TABLE
// ============================================

export type TableProps = VisualBaseProps & {
  rows: Array<Array<string | React.ReactElement<TableCellProps>>>;
  style?: {
    borderWidth?: number;
    borderColor?: string;
    width?: number;
    margin?: number;
  };
};

function TableFn(_props: TableProps): React.ReactElement | null { return null; }
(TableFn as any).isPptxTableElement = true;
(TableFn as any).Cell = TableCell;
export const Table = Object.assign(TableFn, {
  Cell: TableCell,
});
(Table as any).isPptxTableElement = true;
export const isTable = (
  el: React.ReactElement
): el is React.FunctionComponentElement<TableProps> => {
  return el.type instanceof Function && (el.type as any).isPptxTableElement;
};

// ============================================
// LINE (Extended with dash style)
// ============================================

export type LineProps = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  style?: {
    color?: string;
    width?: number;
    // EXTENDED: Dash style
    dashType?: BorderDashStyle;
  };
};
export const Line: React.FC<LineProps> = NodeTypes.LINE as unknown as React.FC;
export const isLine = (
  el: React.ReactElement
): el is React.ReactElement<LineProps> => {
  return el.type === NodeTypes.LINE;
};

// ============================================
// VISUAL TYPES
// ============================================

export type VisualProps = TextProps | ImageProps | ShapeProps;
export type Visual = typeof Text | typeof Image | typeof Shape;

// ============================================
// SLIDE
// ============================================

export type SlideProps = {
  children?: ChildElement<VisualProps>;
  masterName?: string;
  hidden?: boolean;
  style?: {
    backgroundColor?: string;
    backgroundImage?: InternalImageSrc;
  };
  notes?: string;
};
export const Slide: React.FC<SlideProps> =
  NodeTypes.SLIDE as unknown as React.FC;

// ============================================
// MASTER SLIDE
// ============================================

export type MasterSlideProps = {
  name: string;
  children?: ChildElement<VisualProps>;
  style?: {
    backgroundColor?: string;
    backgroundImage?: InternalImageSrc;
  };
};
export const MasterSlide: React.FC<MasterSlideProps> =
  NodeTypes.MASTER_SLIDE as unknown as React.FC;

// ============================================
// PRESENTATION
// ============================================

export type PresentationProps = Omit<
  InternalPresentation,
  "slides" | "masterSlides" | "layout"
> & {
  children?: ChildElement<SlideProps | MasterSlideProps>;
  layout?: InternalPresentation["layout"];
};
export const Presentation: React.FC<PresentationProps> =
  NodeTypes.PRESENTATION as unknown as React.FC;

export const isReactPPTXComponent = (node: React.ReactElement): boolean =>
  Object.values(NodeTypes).includes(node.type as NodeTypes) ||
  isText(node) ||
  isTable(node);
