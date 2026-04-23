import { useState } from "react";
import type { FormEvent } from "react";
import {
  COURSE_LEVEL_DATALIST_ID,
  courseLevelSuggestions,
} from "../../../shared/lib/courseLevelOptions";
import { requestService } from "../services/requestService";

interface CreateRequestPageProps {
  onCreated: () => void;
}

export function CreateRequestPage({ onCreated }: CreateRequestPageProps) {
  const [courseName, setCourseName] = useState("");
  const [courseLevelType, setCourseLevelType] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = courseName.trim();
    const level = courseLevelType.trim();
    if (!name || !level || !driveUrl.trim() || !materialDescription.trim())
      return;
    
    requestService.createRequest({
      courseName: name,
      courseLevelType: level,
      driveUrl: driveUrl.trim(),
      materialDescription: materialDescription.trim(),
      requestedBy: "gif.user",
      assignedTo: "coord.user",
    });

    setCourseName("");
    setCourseLevelType("");
    setDriveUrl("");
    setMaterialDescription("");
    onCreated();
  }

  const inputStyles = "w-full rounded-md border border-slate-200 bg-slate-50/50 p-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelStyles = "block mb-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider";

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Cabecera Corporativa */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">Nueva Solicitud GIF</h2>
          <p className="text-xs text-slate-500">Complete los detalles para procesar el nuevo material.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre de la Materia */}
            <div className="col-span-1">
              <label className={labelStyles}>Nombre de la Materia</label>
              <input
                type="text"
                className={inputStyles}
                placeholder="Ej. Cálculo Integral"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Tipo de Materia */}
            <div className="col-span-1">
              <label className={labelStyles}>Tipo de Materia</label>
              <input
                type="text"
                className={inputStyles}
                placeholder="Seleccione nivel"
                list={COURSE_LEVEL_DATALIST_ID}
                value={courseLevelType}
                onChange={(e) => setCourseLevelType(e.target.value)}
                autoComplete="off"
              />
              <datalist id={COURSE_LEVEL_DATALIST_ID}>
                {courseLevelSuggestions.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Enlace Drive */}
          <div>
            <label className={labelStyles}>Enlace de Google Drive</label>
            <input
              type="url"
              className={inputStyles}
              placeholder="https://drive.google.com/..."
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className={labelStyles}>Descripción del Material</label>
            <textarea
              rows={3}
              className={`${inputStyles} resize-none`}
              placeholder="Detalle los recursos solicitados..."
              value={materialDescription}
              onChange={(e) => setMaterialDescription(e.target.value)}
            />
          </div>

          {/* Acciones */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-blue-700 active:transform active:scale-95"
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}