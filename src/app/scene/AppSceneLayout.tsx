import { motion } from "framer-motion";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  ARENA_BACKGROUND_COLOR,
  ARENA_PAPERCUT_INSET,
  ARENA_TEXTURE_BLEND_MODE,
  ARENA_TEXTURE_POSITION,
  ARENA_TEXTURE_SIZE,
  WAVE_PAPER_TEXTURE_URL,
} from "../theme/surfaceColors";
import { useAuth } from "../../features/auth/AuthContext";
import { BottomPanel } from "./BottomPanel";
import { LoginCard } from "./LoginCard";
import { TopPanel } from "./TopPanel";
import { useVisualTransition, VisualTransitionProvider } from "./VisualTransitionContext";

/**
 * Escena global login ↔ dashboard.
 * - Paneles superior/inferior permanecen montados (no overlay desechable).
 * - Unión recta en fase login; más adelante se puede sustituir solo la geometría de los paneles.
 */
export function AppSceneLayout() {
  return (
    <VisualTransitionProvider>
      <SceneBody />
    </VisualTransitionProvider>
  );
}

function SceneBody() {
  const { user } = useAuth();
  const location = useLocation();
  const { sceneStep } = useVisualTransition();

  if (!user && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  const showLoginLayer = sceneStep === "loginIdle" || sceneStep === "loginCardExit";
  const showDashboardLayer =
    Boolean(user) && (sceneStep === "dashboardPanelsMove" || sceneStep === "dashboardIdle");

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{
        backgroundColor: ARENA_BACKGROUND_COLOR,
        backgroundImage: `url('${WAVE_PAPER_TEXTURE_URL}')`,
        backgroundRepeat: "repeat",
        backgroundSize: ARENA_TEXTURE_SIZE,
        backgroundPosition: ARENA_TEXTURE_POSITION,
        backgroundBlendMode: ARENA_TEXTURE_BLEND_MODE,
        boxShadow: ARENA_PAPERCUT_INSET,
      }}
    >
      {/* Capa de fondo: paneles rectos, z-0, no interceptan eventos */}
      <TopPanel />
      <BottomPanel />

      {/* Contenido y tarjeta por encima */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {showLoginLayer ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center px-4 py-8">
            <LoginCard />
          </div>
        ) : null}

        <motion.div
          className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col"
          initial={false}
          animate={{
            opacity: showDashboardLayer ? 1 : 0,
            y: showDashboardLayer ? 0 : 10,
          }}
          transition={{
            duration: 0.42,
            ease: [0.22, 1, 0.36, 1],
            delay: sceneStep === "dashboardPanelsMove" ? 0.08 : 0,
          }}
          style={{ pointerEvents: showDashboardLayer ? "auto" : "none" }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
