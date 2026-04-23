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

  if (!request) {
    return (
      <div className="relative self-start">
        <div className="absolute left-0 top-0 bottom-0 w-[120px] bg-blue-200 rounded-l-[24px] z-0"></div>
        <div className="absolute -top-10 -left-10 h-20 w-20 rounded-full bg-white border border-slate-200 z-20"></div>
  
        <div className="relative ml-[60px] bg-white rounded-r-[24px] border border-slate-200 shadow-sm p-4 text-sm text-slate-500 z-10 min-h-[420px]">
          Selecciona una solicitud
        </div>
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
    <div className="relative self-start">
      <div className="absolute left-0 top-0 bottom-0 w-[120px] bg-blue-200 rounded-l-[24px] z-0"></div>{" "}
      <div className="absolute -top-10 -left-10 h-20 w-20 rounded-full bg-white border border-slate-200 z-20"></div>
      <div className="relative ml-[60px] bg-white rounded-r-[24px] border border-slate-200 shadow-sm p-4 z-10">
        {" "}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Detalle solicitud</h2>
            <StatusBadge status={stableRequest.status} />
          </div>

          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Materia:</span>{" "}
              {stableRequest.courseName}
            </p>
            <p>
              <span className="font-semibold">Tipo:</span>{" "}
              {stableRequest.courseLevelType}
            </p>
            <p>
              <span className="font-semibold">Material:</span>{" "}
              {stableRequest.materialDescription}
            </p>
          </div>

          <a
            className="text-sm text-blue-600 underline"
            href={stableRequest.driveUrl}
            target="_blank"
            rel="noreferrer"
          >
            Abrir Drive
          </a>

          {role === "COORDINATOR" ? (
            <form className="space-y-2" onSubmit={handleRegisterCredentials}>
              <input
                className="w-full rounded border border-slate-300 p-2"
                placeholder="Usuario LMS"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <input
                className="w-full rounded border border-slate-300 p-2"
                placeholder="Contrasena LMS"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button className="rounded bg-slate-900 px-3 py-2 text-white">
                Registrar credenciales
              </button>
            </form>
          ) : (
            <div className="space-y-2 rounded border border-slate-200 p-3">
              <p className="text-sm">
                Usuario:{" "}
                <span className="font-semibold">
                  {stableRequest.credentials?.username ?? "Pendiente"}
                </span>
              </p>
              <p className="text-sm">
                Contrasena:{" "}
                <span className="font-semibold">
                  {stableRequest.credentials?.password ?? "Pendiente"}
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  className="rounded bg-emerald-600 px-3 py-2 text-white"
                  onClick={() => {
                    requestService.validateRequest(
                      stableRequest.id,
                      "gif.user",
                    );
                    onDone();
                  }}
                >
                  Validar y cerrar
                </button>
                <button
                  className="rounded bg-amber-500 px-3 py-2 text-white"
                  onClick={() => {
                    requestService.returnForAdjustment(
                      stableRequest.id,
                      "gif.user",
                      comment || "Ajustar credenciales",
                    );
                    onDone();
                  }}
                >
                  Devolver
                </button>
              </div>
              <input
                className="w-full rounded border border-slate-300 p-2"
                placeholder="Comentario para devolucion"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </div>
          )}

          <RequestTimelinePanel
            events={requestService.listTimeline(stableRequest.id)}
          />
        </div>
      </div>
    </div>
  );
}
