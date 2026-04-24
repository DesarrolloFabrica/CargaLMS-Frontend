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
    <div className="w-full max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
        
        {/* Cabecera Compacta */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-2.5 flex justify-between items-center">
          <h2 className="text-sm font-bold text-[#00A8B5]">
            {role === "GIF" ? "Mis Solicitudes" : "Bandeja Coordinación"}
          </h2>
          <span className="bg-[#BFF0EA] text-[#00A8B5] text-[10px] font-bold px-2 py-0.5 rounded-full">
            {requests.length} Solicitudes
          </span>
        </div>

        {/* Cuerpo de la Lista - Padding reducido */}
        <div className="divide-y divide-slate-100">
          {requests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xs text-slate-400 italic">No hay registros.</p>
            </div>
          ) : (
            requests.map((request) => (
              <button
                key={request.id}
                className="group flex w-full items-center justify-between px-4 py-3 text-left transition-all hover:bg-slate-50 active:bg-blue-50"
                onClick={() => onOpenRequest(request.id)}
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                      {request.courseName}
                    </p>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-tighter shrink-0">
                      • {request.courseLevelType}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-slate-500 line-clamp-1 opacity-80">
                    {request.materialDescription}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {/* StatusBadge adaptado a escala menor si es posible */}
                  <div className="scale-90 origin-right">
                    <StatusBadge status={request.status} />
                  </div>
                  
                  <svg 
                    className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-all" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="9 5l7 7-7 7" />
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