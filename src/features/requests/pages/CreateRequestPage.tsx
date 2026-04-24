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

  // Estilos más compactos
  const inputStyles = "w-full rounded border border-slate-200 bg-slate-50/50 p-2 text-xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelStyles = "block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-tight";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
        {/* Cabecera Compacta */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 flex justify-between items-center">
          <h2 className="text-sm font-bold text-[#00A8B5]">Nueva Solicitud</h2>
          <span className="text-[10px] bg-[#BFF0EA] text-[#00A8B5] px-2 py-0.5 rounded font-bold uppercase">GIF</span>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Nombre */}
            <div className="col-span-1">
              <label className={labelStyles}>Materia</label>
              <input
                type="text"
                className={inputStyles}
                placeholder="Nombre..."
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Tipo */}
            <div className="col-span-1">
              <label className={labelStyles}>Nivel / Tipo</label>
              <input
                type="text"
                className={inputStyles}
                placeholder="Seleccione..."
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
            <label className={labelStyles}>URL de Google Drive</label>
            <input
              type="url"
              className={inputStyles}
              placeholder="Enlace de la carpeta..."
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
            />
          </div>

          {/* Descripción - Altura reducida */}
          <div>
            <label className={labelStyles}>Descripción</label>
            <textarea
              rows={2}
              className={`${inputStyles} resize-none`}
              placeholder="Breve detalle del material..."
              value={materialDescription}
              onChange={(e) => setMaterialDescription(e.target.value)}
            />
          </div>

          {/* Botón más compacto */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full rounded bg-[#00A8B5] py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#018f9b] active:scale-[0.98]"
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}