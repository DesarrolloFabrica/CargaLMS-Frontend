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
    <div className="relative">
      <div className="absolute left-0 top-0 h-full w-30 bg-blue-200 rounded-l-[24px] z-0"></div>
      <div className="absolute -top-10 -left-10 h-20 w-20 rounded-full bg-white border border-slate-200 z-20"></div>
  
      <div className="relative ml-15 bg-white rounded-r-[24px] border border-slate-200 shadow-sm p-4 z-10">
        <h2 className="mb-3 text-lg font-semibold">
          {role === "GIF" ? "Mis solicitudes" : "Bandeja coordinador"}
        </h2>
  
        <div className="space-y-2">
          {requests.length === 0 ? (
            <p className="text-sm text-slate-500">Sin solicitudes</p>
          ) : null}
  
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
    </div>
  );
}
