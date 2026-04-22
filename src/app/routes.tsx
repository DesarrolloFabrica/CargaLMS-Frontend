import { Navigate, Route, Routes } from "react-router-dom";
import { AppSceneLayout } from "./scene/AppSceneLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { GifDashboardPage } from "../features/requests/pages/GifDashboardPage";
import { CoordinatorQueuePage } from "../features/requests/pages/CoordinatorQueuePage";
import { RequireRole } from "./RequireRole";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppSceneLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireRole role="GIF">
              <GifDashboardPage />
            </RequireRole>
          }
        />
        <Route
          path="/coordinator"
          element={
            <RequireRole role="COORDINATOR">
              <CoordinatorQueuePage />
            </RequireRole>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}
