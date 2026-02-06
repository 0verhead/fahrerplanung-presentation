// react-pptx-extended
// A fork of react-pptx with extended features: shadows, glow, rotation, etc.

export * from "./nodes";
export * from "./renderer";
export {
  HexColor,
  ComplexColor,
  InternalImage,
  InternalShape,
  InternalText,
  InternalPresentation,
  InternalSlide,
  InternalSlideObject,
  InternalShadow,
  InternalGlow,
  normalizeJsx,
  normalizeHexColor,
  normalizeShadow,
  normalizeGlow,
} from "./normalizer";
export { flattenChildren } from "./util";
