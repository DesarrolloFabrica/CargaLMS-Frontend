// ===============================
// COLORES BASE DE LAS CAPAS
// ===============================
export const WAVE_LAYER_TOP_COLOR = "#00bbc0";
export const WAVE_LAYER_MIDDLE_COLOR = "#9ff9ed";
export const WAVE_LAYER_BOTTOM_COLOR = "#e0fffb";

// ===============================
// TEXTURA DEL MAR
// ===============================
export const WAVE_PAPER_TEXTURE_URL = "/textures/landscape-shot-white-textured-background.jpg";
export const WAVE_PAPER_TEXTURE_SIZE = "420px auto";
export const WAVE_PAPER_TEXTURE_BLEND_MODE = "multiply";
export const WAVE_FRONT_TEXTURE_POSITION = "0px 0px";

// ===============================
// ARENA
// ===============================
export const ARENA_BACKGROUND_COLOR = "#F1E4C8";
export const ARENA_TEXTURE_SIZE = "620px auto";
export const ARENA_TEXTURE_BLEND_MODE = "multiply";
export const ARENA_TEXTURE_POSITION = "120px 40px";

// ===============================
// SOMBRAS EN FRANJA (borde de superposición)
// La sombra NO usa la ola completa: máscara = intersección( SVG ola, gradiente )
// → solo una banda cerca del borde inferior (top panel) o superior (bottom panel).
// Transparencia solo con rgba(...) en backgroundColor (sin opacity CSS en la sombra).
// ===============================
export const PAPERCUT_SHADOW_RGB = "100, 116, 139";

/** Grosor relativo de la franja (% del alto del contenedor). Ajusta mid ↑ = franja más gruesa. */
export const WAVE_TOP_SHADOW_BAND = {
  transparentUntilPct: 58,
  opaqueFromPct: 80,
} as const;

export const WAVE_BOTTOM_SHADOW_BAND = {
  transparentUntilPct: 10,
  opaqueFromPct: 10,
} as const;

/** Ola superior: sombra hacia la arena (abajo). */
export const WAVE_TOP_PAPERCUT_SHADOW = {
  back: { offsetX: 2, offsetY: 4, blurPx: 12, opacity: 0.40 },
  middle: { offsetX: 1, offsetY: 4, blurPx: 12, opacity: 0.40 },
  front: { offsetX: 1, offsetY: 4, blurPx: 12, opacity: 0.04 },
} as const;

/** Ola inferior: sombra hacia el centro (arriba). */
export const WAVE_BOTTOM_PAPERCUT_SHADOW = {
  back: { offsetX: -2, offsetY: -4, blurPx: 12, opacity: 0.40 },
  middle: { offsetX: -1, offsetY: -4, blurPx:12, opacity: 0.40 },
  front: { offsetX: -1, offsetY: -4, blurPx:12, opacity: 0.040 },
} as const;

// ===============================
// RELIEVE SUAVE DE LA ARENA
// Muy sutil para que no compita con las olas.
// ===============================
export const ARENA_PAPERCUT_INSET =
  "inset 0 4px 8px rgba(255, 255, 255, 0.10), inset 0 -1px 3px rgba(23, 37, 61, 0.05)";

export const HERO_HEADER_COLOR = WAVE_LAYER_TOP_COLOR;