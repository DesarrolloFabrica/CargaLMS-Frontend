import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteShell } from "../../../app/shell/SiteShell";
import { useAuth } from "../../auth/AuthContext";
import { NotificationBell } from "../../notifications/components/NotificationBell";
import { MyRequestsPage } from "./MyRequestsPage";
import { RequestWorkDetailPage } from "./RequestWorkDetailPage";

export function CoordinatorQueuePage() {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <SiteShell
      integratedScene
      navRole="COORDINATOR"
      heroVariant="coordinator"
      headerActions={
        <div className="flex flex-wrap items-center gap-2">
          <NotificationBell role="COORDINATOR" />
          <button
            type="button"
            onClick={handleLogout}
            className="border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
          >
            Cerrar sesion
          </button>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <MyRequestsPage role="COORDINATOR" onOpenRequest={setSelectedRequestId} />
        <RequestWorkDetailPage
          requestId={selectedRequestId}
          role="COORDINATOR"
          onDone={() => setSelectedRequestId(null)}
        />
      </div>
    </SiteShell>
  );
}
