import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useVisualTransition } from "../../../app/scene/VisualTransitionContext";

/**
 * Ruta `/login`: la tarjeta real vive en `AppSceneLayout` (LoginCard).
 * Aquí solo redirigimos si ya hay sesión estable (p. ej. usuario vuelve a /login estando logueado).
 */
export function LoginPage() {
  const { user } = useAuth();
  const { sceneStep } = useVisualTransition();
  const location = useLocation();

  if (user && sceneStep === "dashboardIdle" && location.pathname === "/login") {
    return <Navigate to={user.role === "GIF" ? "/" : "/coordinator"} replace />;
  }

  return null;
}
