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

import CoralImg from "../../../public/img/Login/Coral.png";
import CaballoImg from "../../../public/img/Login/CaballoMar.png";

/**
 * Tipo de identificador para las 3 capas del panel inferior.
 */
type WaveTierId = "back" | "middle" | "front";

/**
 * Orden de render de las capas.
 * Se dibuja primero la de atrás y al final la frontal.
 */
const BOTTOM_WAVE_ORDER: WaveTierId[] = ["back", "middle", "front"];

/**
 * Configuración visual de cada capa inferior.
 * Aquí defines color, desplazamiento vertical, opacidad y posición de textura.
 */
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
 * Configuración opcional para imágenes/decoraciones dentro de cada capa.
 *
 * Cada capa puede tener varias imágenes.
 * Solo debes:
 * 1. importar la imagen arriba
 * 2. agregarla en el array de la capa deseada
 *
 * Ejemplo:
 *
 * import conchaImg from "../../assets/images/concha.png";
 * import coralImg from "../../assets/images/coral.png";
 *
 * front: [
 *   {
 *     src: conchaImg,
 *     alt: "Concha decorativa",
 *     className: "absolute right-[8%] top-[12%] w-[140px] max-w-[16vw] object-contain",
 *     style: {
 *       filter: "drop-shadow(0px 6px 8px rgba(0,0,0,0.25))",
 *     },
 *   },
 *   {
 *     src: coralImg,
 *     alt: "Coral decorativo",
 *     className: "absolute left-[10%] top-[18%] w-[180px] max-w-[18vw] object-contain",
 *   },
 * ]
 */
const BOTTOM_LAYER_DECORATIONS: Partial<
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
      src: CoralImg,
      alt: "Concha decorativa",
      className:
        "absolute right-[30%] top-[60%] w-[270px] max-w-[16vw] object-contain",
      style: {
        filter: "drop-shadow(0px 6px 8px rgba(0,0,0,0.25))",
        transform: "translateY(50px)",
      },
    },
    {
      src: CaballoImg,
      alt: "Concha decorativa",
      className:
        "absolute right-[70%] top-[50%] w-[270px] max-w-[10vw] object-contain",
      style: {
        filter: "drop-shadow(0px 6px 8px rgba(0,0,0,0.25))",
        transform: "translateY(50px)",
      },
    },
  ],
};

export function BottomPanel() {
  const { bottomPanelHeight, sceneStep } = useVisualTransition();

  return (
    <motion.div
      className="pointer-events-none absolute bottom-0 left-0 right-0  overflow-visible"
      initial={false}
      animate={{ height: bottomPanelHeight }}
      transition={{ duration: PANEL_MOVE_DURATION_S, ease: PANEL_EASE }}
      style={{
        willChange: sceneStep === "dashboardPanelsMove" ? "height" : "auto",
      }}
    >
      <div className="relative h-full w-full overflow-visible">
        {BOTTOM_WAVE_ORDER.flatMap((tier, tierIndex) => {
          // Datos visuales de la capa actual
          const layer = BOTTOM_WAVE_LAYERS[tier];

          // Datos de sombra de la capa actual
          const shadow = WAVE_BOTTOM_PAPERCUT_SHADOW[tier];

          // Decoraciones opcionales de la capa actual
          const decorations = BOTTOM_LAYER_DECORATIONS[tier];

          // z-index: primero la sombra, luego la capa principal
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

          const bandGradient = `linear-gradient(
            to top,
            transparent 0%,
            transparent ${WAVE_BOTTOM_SHADOW_BAND.transparentUntilPct}%,
            #000 ${WAVE_BOTTOM_SHADOW_BAND.opaqueFromPct}%,
            #000 100%
          )`;

          /**
           * Máscara compuesta para la sombra:
           * intersección entre la forma de la ola y la franja del gradiente.
           */
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
            /**
             * Sombra de la capa
             */
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

            /**
             * Capa principal visible.
             * Aquí adentro se insertan las imágenes para que se muevan con la capa.
             */
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
                transform: `translateY(${layer.translateYPx}px)`,
                ...maskStyles,
              }}
            >
              {/**
               * Wrapper interno relativo para posicionar elementos decorativos con absolute.
               * Ocupa todo el tamaño de la capa.
               */}
              <div className="absolute inset-x-0 top-0 h-[520px]">
                {decorations?.map((item, index) => (
                  <img
                    key={`${tier}-decoration-${index}`}
                    src={item.src}
                    alt={item.alt}
                    className={
                      item.className ??
                      "absolute left-[8%] bottom-[%] w-[160px] max-w-[18vw] object-contain"
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
