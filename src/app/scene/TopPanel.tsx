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
  WAVE_TOP_PAPERCUT_SHADOW,
  WAVE_TOP_SHADOW_BAND,
} from "../theme/surfaceColors";
import { PANEL_EASE, PANEL_MOVE_DURATION_S } from "./sceneConstants";
import { useVisualTransition } from "./VisualTransitionContext";

import estrellaImg from "../../../public/img/Login/EstrellaMar.png";
import tortugaImg from "../../../public/img/Login/TortugaVerde.png";

/**
 * Tipo de identificador para las 3 capas del panel superior.
 */
type WaveTierId = "back" | "middle" | "front";

/**
 * Orden de render de las capas.
 * Se dibuja primero la de atrás y al final la frontal.
 */
const TOP_WAVE_ORDER: WaveTierId[] = ["back", "middle", "front"];

/**
 * Configuración visual de cada capa superior.
 * Aquí defines color, desplazamiento vertical, opacidad y posición de textura.
 */
const TOP_WAVE_LAYERS: Record<
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
    translateYPx: 34,
    opacity: 0.78,
    texturePosition: "-140px 18px",
  },
  middle: {
    id: "middle",
    color: WAVE_LAYER_MIDDLE_COLOR,
    translateYPx: 18,
    opacity: 0.88,
    texturePosition: "96px -42px",
  },
  front: {
    id: "front",
    color: WAVE_LAYER_TOP_COLOR,
    translateYPx: 0,
    opacity: 1,
    texturePosition: WAVE_FRONT_TEXTURE_POSITION,
  },
};

const TOP_LAYER_DECORATIONS: Partial<
  Record<
    WaveTierId,
    {
      src: string;
      alt: string;
      className?: string;
      style?: CSSProperties;
    }[]
  >
> = {
  back: [],
  middle: [],
  front: [
    {
      src: estrellaImg,
      alt: "Estrella",
      className: "absolute left-[30%] bottom-[50%] w-[100px]",
      style: {
        filter: "drop-shadow(0px 6px 8px rgba(0,0,0,0.25))",
      },
    },
    {
      src: tortugaImg,
      alt: "Tortuga",
      className: "absolute right-[8%] bottom-[40%] w-[300px]",
      style: {
        filter: "drop-shadow(0px 6px 8px rgba(0,0,0,0.25))",
      },
    },
  ],
};

/**
 * Bloque superior persistente.
 * - En login ocupa la mitad superior.
 * - En dashboard se convierte en la franja tipo hero.
 *
 * Las sombras se recortan con la máscara de la ola.
 * Las decoraciones/imágenes se insertan dentro del div principal de cada capa
 * para que hereden el mismo movimiento automáticamente.
 */
export function TopPanel() {
  const { topPanelHeight, sceneStep } = useVisualTransition();

  return (
    <motion.div
      className="pointer-events-none absolute left-0 right-0 top-0 z-2 overflow-visible"
      initial={false}
      animate={{ height: topPanelHeight }}
      transition={{ duration: PANEL_MOVE_DURATION_S, ease: PANEL_EASE }}
      style={{
        willChange: sceneStep === "dashboardPanelsMove" ? "height" : "auto",
      }}
    >
      <div className="relative h-full w-full overflow-visible">
        {TOP_WAVE_ORDER.flatMap((tier, tierIndex) => {
          const layer = TOP_WAVE_LAYERS[tier];
          const shadow = WAVE_TOP_PAPERCUT_SHADOW[tier];
          const decorations = TOP_LAYER_DECORATIONS[tier];
          const zShadow = tierIndex * 2;
          const zMain = tierIndex * 2 + 1;

          const maskStyles = {
            WebkitMaskImage: "url('/svg/ola-top-mask.svg')",
            WebkitMaskRepeat: "no-repeat" as const,
            WebkitMaskPosition: "center center",
            WebkitMaskSize: "100% 100%",
            maskImage: "url('/svg/ola-top-mask.svg')",
            maskRepeat: "no-repeat" as const,
            maskPosition: "center center",
            maskSize: "100% 100%",
          };

          const bandGradient = `linear-gradient(
            to bottom,
            transparent 0%,
            transparent ${WAVE_TOP_SHADOW_BAND.transparentUntilPct}%,
            #000 ${WAVE_TOP_SHADOW_BAND.opaqueFromPct}%,
            #000 100%
          )`;

          const shadowMaskStyles: CSSProperties = {
            WebkitMaskImage: `url('/svg/ola-top-mask.svg'), ${bandGradient}`,
            WebkitMaskRepeat: "no-repeat, no-repeat",
            WebkitMaskPosition: "center, center",
            WebkitMaskSize: "100% 100%, 100% 100%",
            WebkitMaskComposite: "source-in",
            maskImage: `url('/svg/ola-top-mask.svg'), ${bandGradient}`,
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
              className="scene-panel scene-panel-top absolute inset-0"
              style={{
                zIndex: zMain,
                backgroundColor: layer.color,
                backgroundImage: `url('${WAVE_PAPER_TEXTURE_URL}')`,
                backgroundRepeat: "repeat",
                backgroundSize: WAVE_PAPER_TEXTURE_SIZE,
                backgroundPosition: layer.texturePosition,
                backgroundBlendMode: WAVE_PAPER_TEXTURE_BLEND_MODE,
                transform: `translateY(${layer.translateYPx}px)`,
                ...maskStyles,
              }}
            >
            <div className="absolute inset-x-0 bottom-0 h-[520px]">                
              {decorations?.map((item, index) => (
                  <img
                    key={`${tier}-decoration-${index}`}
                    src={item.src}
                    alt={item.alt}
                    className={
                      item.className ??
                      "absolute left-[8%] bottom-[20%] w-[160px] max-w-[18vw] object-contain"
                    }
                    style={item.style}
                    draggable={false}
                  />
                ))}
              </div>
            </div>,
          ];
        })}
      </div>
    </motion.div>
  );
}