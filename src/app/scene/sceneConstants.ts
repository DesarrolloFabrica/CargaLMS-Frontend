/**
 * Constantes de la escena login → dashboard (fase recta).
 * ---------------------------------------------------------------------------
 * Evolución futura (ondas / clip-path): conservar los nombres de fase en
 * `VisualTransitionContext` y sustituir solo cómo se calculan las alturas
 * o se componen los nodos `TopPanel` / `BottomPanel`, sin cambiar el
 * contrato del contexto ni el flujo de pasos (tarjeta → paneles → contenido).
 */

/**
 * Altura final del bloque superior (desde el borde superior del viewport).
 * Debe cubrir la cabecera blanca + el hero transparente donde se ve el panel.
 * Calibración: punto medio entre el valor anterior (200px, corto) y la pila
 * real de contenido (~cabecera ~84px + hero con texto ~200–240px).
 */
export const DASHBOARD_HEADER_STACK_PX = 72;
/** Altura mínima solo del área de texto del hero (sin cabecera). */
export const DASHBOARD_HERO_CONTENT_MIN_PX = 132;
export const DASHBOARD_TOP_PANEL_PX = DASHBOARD_HEADER_STACK_PX + DASHBOARD_HERO_CONTENT_MIN_PX;

/** Altura final del bloque inferior (simula el fondo del footer). */
export const DASHBOARD_BOTTOM_PANEL_PX = 120;

/** En login, cada bloque ocupa la mitad de la ventana; unión recta al 50%. */
export const LOGIN_PANEL_HEIGHT = "60vh";

export const CARD_EXIT_DURATION_S = 0.35;
export const PANEL_MOVE_DURATION_S = 0.55;

/** Curva institucional, suave al inicio y al final. */
export const PANEL_EASE = [0.22, 1, 0.36, 1] as const;
