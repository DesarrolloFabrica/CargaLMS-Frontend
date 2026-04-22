import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  PAPERCUT_SHADOW_RGB,
  WAVE_LAYER_BOTTOM_COLOR,
  WAVE_LAYER_MIDDLE_COLOR,
  WAVE_PAPER_TEXTURE_URL,
  WAVE_PAPER_TEXTURE_BLEND_MODE,
  WAVE_PAPER_TEXTURE_SIZE,
  WAVE_FRONT_TEXTURE_POSITION,
  WAVE_LAYER_TOP_COLOR,
  WAVE_BOTTOM_PAPERCUT_SHADOW,
  WAVE_BOTTOM_SHADOW_BAND,
} from "../theme/surfaceColors";
import { PANEL_EASE, PANEL_MOVE_DURATION_S } from "./sceneConstants";
import { useVisualTransition } from "./VisualTransitionContext";

type WaveTierId = "back" | "middle" | "front";

const BOTTOM_WAVE_ORDER: WaveTierId[] = ["back", "middle", "front"];

const BOTTOM_WAVE_LAYERS: Record<
  WaveTierId,
  {
    id: WaveTierId;
    color: string;
    translateYPx: number;
    opacity: number;
    texturePosition: string;
  }
> = {
  back: {
    id: "back",
    color: WAVE_LAYER_BOTTOM_COLOR,
    translateYPx: -30,
    opacity: 0.74,
    texturePosition: "128px 54px",
  },
  middle: {
    id: "middle",
    color: WAVE_LAYER_MIDDLE_COLOR,
    translateYPx: -16,
    opacity: 0.86,
    texturePosition: "-104px -26px",
  },
  front: {
    id: "front",
    color: WAVE_LAYER_TOP_COLOR,
    translateYPx: 0,
    opacity: 1,
    texturePosition: WAVE_FRONT_TEXTURE_POSITION,
  },
};

/**
 * Bloque inferior persistente (recto). Login: mitad inferior; dashboard: franja tipo footer.
 * Sombras: franja cerca del borde superior (máscara ola ∩ gradiente), sin textura.
 */
export function BottomPanel() {
  const { bottomPanelHeight, sceneStep } = useVisualTransition();

  return (
    <motion.div
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 overflow-visible"
      initial={false}
      animate={{ height: bottomPanelHeight }}
      transition={{ duration: PANEL_MOVE_DURATION_S, ease: PANEL_EASE }}
      style={{ willChange: sceneStep === "dashboardPanelsMove" ? "height" : "auto" }}
    >
      <div className="relative h-full w-full overflow-visible">
        {BOTTOM_WAVE_ORDER.flatMap((tier, tierIndex) => {
          const layer = BOTTOM_WAVE_LAYERS[tier];
          const shadow = WAVE_BOTTOM_PAPERCUT_SHADOW[tier];
          const zShadow = tierIndex * 2;
          const zMain = tierIndex * 2 + 1;

          const maskStyles = {
            WebkitMaskImage: "url('/svg/ola-bottom-mask.svg')",
            WebkitMaskRepeat: "no-repeat" as const,
            WebkitMaskPosition: "center center",
            WebkitMaskSize: "100% 100%",
            maskImage: "url('/svg/ola-bottom-mask.svg')",
            maskRepeat: "no-repeat" as const,
            maskPosition: "center center",
            maskSize: "100% 100%",
          };

          const bandGradient = `linear-gradient(to top, transparent 0%, transparent ${WAVE_BOTTOM_SHADOW_BAND.transparentUntilPct}%, #000 ${WAVE_BOTTOM_SHADOW_BAND.opaqueFromPct}%, #000 100%)`;
          const shadowMaskStyles: CSSProperties = {
            WebkitMaskImage: `url('/svg/ola-bottom-mask.svg'), ${bandGradient}`,
            WebkitMaskRepeat: "no-repeat, no-repeat",
            WebkitMaskPosition: "center, center",
            WebkitMaskSize: "100% 100%, 100% 100%",
            WebkitMaskComposite: "source-in",
            maskImage: `url('/svg/ola-bottom-mask.svg'), ${bandGradient}`,
            maskRepeat: "no-repeat, no-repeat",
            maskPosition: "center, center",
            maskSize: "100% 100%, 100% 100%",
            maskComposite: "intersect",
          };

          return [
            <div
              key={`${tier}-shadow`}
              aria-hidden
              className="absolute inset-0"
              style={{
                zIndex: zShadow,
                transformOrigin: "center center",
                backgroundColor: `rgba(${PAPERCUT_SHADOW_RGB}, ${shadow.opacity})`,
                transform: `translate(${shadow.offsetX}px, ${layer.translateYPx + shadow.offsetY}px)`,
                filter: `blur(${shadow.blurPx}px)`,
                ...shadowMaskStyles,
              }}
            />,
            <div
              key={`${tier}-main`}
              aria-hidden
              className="scene-panel scene-panel-bottom absolute inset-0"
              style={{
                zIndex: zMain,
                backgroundColor: layer.color,
                backgroundImage: `url('${WAVE_PAPER_TEXTURE_URL}')`,
                backgroundRepeat: "repeat",
                backgroundSize: WAVE_PAPER_TEXTURE_SIZE,
                backgroundPosition: layer.texturePosition,
                backgroundBlendMode: WAVE_PAPER_TEXTURE_BLEND_MODE,
                opacity: layer.opacity,
                transform: `translateY(${layer.translateYPx}px)`,
                ...maskStyles,
              }}
            />,
          ];
        })}
      </div>
    </motion.div>
  );
}
