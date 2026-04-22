import type { UserRole } from "../../../shared/types/domain";
import { StatusBadge } from "../../../shared/ui/StatusBadge";
import { requestService } from "../services/requestService";

interface MyRequestsPageProps {
  role: UserRole;
  onOpenRequest: (requestId: string) => void;
}

export function MyRequestsPage({ role, onOpenRequest }: MyRequestsPageProps) {
  const requests = requestService.listRequestsByRole(role);
  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="mb-3 text-lg font-semibold">{role === "GIF" ? "Mis solicitudes" : "Bandeja coordinador"}</h2>
      <div className="space-y-2">
        {requests.length === 0 ? <p className="text-sm text-slate-500">Sin solicitudes</p> : null}
        {requests.map((request) => (
          <button
            key={request.id}
            className="flex w-full items-center justify-between rounded border border-slate-200 px-3 py-2 text-left"
            onClick={() => onOpenRequest(request.id)}
          >
            <div>
              <p className="text-sm font-medium">{request.courseName}</p>
              <p className="text-xs text-slate-600">
                {request.courseLevelType} · {request.materialDescription}
              </p>
              <p className="text-xs text-slate-500">{request.driveUrl}</p>
            </div>
            <StatusBadge status={request.status} />
          </button>
        ))}
      </div>
    </div>
  );
}
