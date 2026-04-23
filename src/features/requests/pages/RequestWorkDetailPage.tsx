import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { UserRole } from "../../../shared/types/domain";
import { RequestTimelinePanel } from "../../workflow/components/RequestTimelinePanel";
import { requestService } from "../services/requestService";
import { StatusBadge } from "../../../shared/ui/StatusBadge";

interface RequestWorkDetailPageProps {
  requestId: string | null;
  role: UserRole;
  onDone: () => void;
}

export function RequestWorkDetailPage({
  requestId,
  role,
  onDone,
}: RequestWorkDetailPageProps) {
  const request = useMemo(
    () =>
      requestService
        .listRequestsByRole("GIF")
        .find((item) => item.id === requestId) ?? null,
    [requestId],
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comment, setComment] = useState("");

  const inputStyles = "w-full rounded-md border border-slate-200 bg-slate-50/50 p-2 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelStyles = "block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider";

  if (!request) {
    return (
      <div className="flex h-full min-h-[640px] w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/30 p-12">
        <p className="text-sm text-slate-400 font-medium italic">Selecciona una solicitud para ver el detalle</p>
      </div>
    );
  }

  const stableRequest = request;

  function handleRegisterCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username || !password) return;
    requestService.registerCredentials({
      requestId: stableRequest.id,
      username,
      password,
      actorId: "coord.user",
    });
    onDone();
  }

  return (
    <div className="h-full w-full">
      <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Cabecera con Estado */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Detalle de Solicitud</h2>
            <p className="text-xs text-slate-500">ID: {stableRequest.id.slice(0, 8)}...</p>
          </div>
          <StatusBadge status={stableRequest.status} />
        </div>

        <div className="p-6 space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4 border border-slate-100">
            <div className="col-span-2">
              <label className={labelStyles}>Materia / Curso</label>
              <p className="text-sm font-semibold text-slate-700">{stableRequest.courseName}</p>
            </div>
            <div>
              <label className={labelStyles}>Tipo</label>
              <p className="text-sm text-slate-600">{stableRequest.courseLevelType}</p>
            </div>
            <div>
              <label className={labelStyles}>Recursos</label>
              <a 
                href={stableRequest.driveUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
              >
                Carpeta Drive 
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200/60">
              <label className={labelStyles}>Descripción del material</label>
              <p className="text-sm text-slate-600 leading-relaxed">{stableRequest.materialDescription}</p>
            </div>
          </div>

          {/* Sección de Gestión de Credenciales */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              Gestión de Acceso LMS
            </h3>

            {role === "COORDINATOR" ? (
              <form className="space-y-3" onSubmit={handleRegisterCredentials}>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className={inputStyles}
                    placeholder="Usuario LMS"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    type="password"
                    className={inputStyles}
                    placeholder="Contraseña LMS"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800">
                  Registrar Credenciales
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                  <div className="flex-1">
                    <label className={labelStyles}>Usuario</label>
                    <p className="text-sm font-mono font-medium">{stableRequest.credentials?.username ?? "—"}</p>
                  </div>
                  <div className="flex-1">
                    <label className={labelStyles}>Contraseña</label>
                    <p className="text-sm font-mono font-medium">{stableRequest.credentials?.password ?? "—"}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <textarea
                    className={inputStyles}
                    placeholder="Escribe un comentario solo si vas a devolver la solicitud..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                      onClick={() => {
                        requestService.validateRequest(stableRequest.id, "gif.user");
                        onDone();
                      }}
                    >
                      Validar y Cerrar
                    </button>
                    <button
                      className="flex-1 rounded-lg bg-white border border-amber-200 px-4 py-2 text-sm font-bold text-amber-600 transition-colors hover:bg-amber-50"
                      onClick={() => {
                        requestService.returnForAdjustment(stableRequest.id, "gif.user", comment || "Ajustar credenciales");
                        onDone();
                      }}
                    >
                      Devolver para Ajuste
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Línea de tiempo */}
          <div className="pt-6 border-t border-slate-100">
            <label className={labelStyles}>Historial de Actividad</label>
            <RequestTimelinePanel
              events={requestService.listTimeline(stableRequest.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}