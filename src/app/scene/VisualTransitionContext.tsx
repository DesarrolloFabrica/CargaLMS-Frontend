/* eslint-disable react-refresh/only-export-components -- Provider + hook comparten contexto estable. */
import type { ReactNode } from "react";
import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_SESSION_STORAGE_KEY } from "../../features/auth/constants";
import { useAuth } from "../../features/auth/AuthContext";
import {
  CARD_EXIT_DURATION_S,
  DASHBOARD_BOTTOM_PANEL_PX,
  DASHBOARD_TOP_PANEL_PX,
  LOGIN_PANEL_HEIGHT,
  PANEL_MOVE_DURATION_S,
} from "./sceneConstants";

/**
 * Pasos de la transición (orden fijo).
 * Para evolución a ondas: conservar estos pasos y cambiar solo geometría de paneles.
 */
export type SceneStep = "loginIdle" | "loginCardExit" | "dashboardPanelsMove" | "dashboardIdle";

interface VisualTransitionContextValue {
  sceneStep: SceneStep;
  topPanelHeight: string;
  bottomPanelHeight: string;
  runPostLoginTransition: (targetPath: string) => void;
}

const VisualTransitionContext = createContext<VisualTransitionContextValue | null>(null);

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function initialSceneStep(): SceneStep {
  if (typeof window === "undefined") return "loginIdle";
  return sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY) ? "dashboardIdle" : "loginIdle";
}

export function VisualTransitionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sceneStep, setSceneStep] = useState<SceneStep>(initialSceneStep);
  const sequenceLock = useRef(false);

  /** Cerrar sesión: volver al estado visual de login (paneles 50/50). */
  useEffect(() => {
    if (!user) {
      sequenceLock.current = false;
      startTransition(() => setSceneStep("loginIdle"));
    }
  }, [user]);

  const runPostLoginTransition = useCallback(
    async (targetPath: string) => {
      if (sequenceLock.current) return;
      sequenceLock.current = true;
      try {
        setSceneStep("loginCardExit");
        await sleep(Math.round(CARD_EXIT_DURATION_S * 1000) + 50);
        /* Primero fase dashboard + paneles, luego navegar: evita un frame con ruta nueva y capa login aún visible. */
        setSceneStep("dashboardPanelsMove");
        navigate(targetPath, { replace: true });
        await sleep(Math.round(PANEL_MOVE_DURATION_S * 1000) + 60);
        setSceneStep("dashboardIdle");
      } finally {
        sequenceLock.current = false;
      }
    },
    [navigate],
  );

  const { topPanelHeight, bottomPanelHeight } = useMemo(() => {
    const isLoginLayout = sceneStep === "loginIdle" || sceneStep === "loginCardExit";
    return {
      topPanelHeight: isLoginLayout ? LOGIN_PANEL_HEIGHT : `${DASHBOARD_TOP_PANEL_PX}px`,
      bottomPanelHeight: isLoginLayout ? LOGIN_PANEL_HEIGHT : `${DASHBOARD_BOTTOM_PANEL_PX}px`,
    };
  }, [sceneStep]);

  const value = useMemo(
    () => ({
      sceneStep,
      topPanelHeight,
      bottomPanelHeight,
      runPostLoginTransition,
    }),
    [sceneStep, topPanelHeight, bottomPanelHeight, runPostLoginTransition],
  );

  return <VisualTransitionContext.Provider value={value}>{children}</VisualTransitionContext.Provider>;
}

export function useVisualTransition() {
  const ctx = useContext(VisualTransitionContext);
  if (!ctx) throw new Error("useVisualTransition debe usarse dentro de VisualTransitionProvider");
  return ctx;
}
