import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteShell } from "../../../app/shell/SiteShell";
import { useAuth } from "../../auth/AuthContext";
import { NotificationBell } from "../../notifications/components/NotificationBell";
import { CreateRequestPage } from "./CreateRequestPage";
import { MyRequestsPage } from "./MyRequestsPage";
import { RequestWorkDetailPage } from "./RequestWorkDetailPage";

export function GifDashboardPage() {
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
      navRole="GIF"
      heroVariant="gif"
      headerActions={
        <div className="flex flex-wrap items-center gap-2">
          <NotificationBell role="GIF" />
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
      <div className="grid items-start gap-4 md:grid-cols-2">
        <CreateRequestPage onCreated={() => setSelectedRequestId(null)} />
        <div className="h-full md:row-span-2">
          <RequestWorkDetailPage
            requestId={selectedRequestId}
            role="GIF"
            onDone={() => setSelectedRequestId(null)}
          />
        </div>
        <MyRequestsPage role="GIF" onOpenRequest={setSelectedRequestId} />
      </div>
    </SiteShell>
  );
}
