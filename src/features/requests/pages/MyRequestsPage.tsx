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
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        
        {/* Cabecera Corporativa */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {role === "GIF" ? "Mis Solicitudes" : "Bandeja de Coordinación"}
            </h2>
            <p className="text-xs text-slate-500">
              {role === "GIF" 
                ? "Seguimiento de tus materiales enviados" 
                : "Gestión y revisión de solicitudes entrantes"}
            </p>
          </div>
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
            {requests.length} Total
          </span>
        </div>

        {/* Cuerpo de la Lista */}
        <div className="divide-y divide-slate-100">
          {requests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-slate-400 italic">No se encontraron solicitudes registradas.</p>
            </div>
          ) : (
            requests.map((request) => (
              <button
                key={request.id}
                className="group flex w-full items-center justify-between p-5 text-left transition-all hover:bg-blue-50/30 active:bg-blue-50"
                onClick={() => onOpenRequest(request.id)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {request.courseName}
                    </p>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-tight">
                      {request.courseLevelType}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-600 line-clamp-1 max-w-md">
                    {request.materialDescription}
                  </p>
                  
                  <p className="text-[11px] text-blue-500 font-medium truncate max-w-xs opacity-80">
                    {request.driveUrl}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <StatusBadge status={request.status} />
                  {/* Flecha indicadora de acción (Chevron) */}
                  <svg 
                    className="h-5 w-5 text-slate-300 group-hover:text-slate-400 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}