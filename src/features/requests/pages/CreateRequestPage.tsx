import { useState } from "react";
import type { FormEvent } from "react";
import { COURSE_LEVEL_DATALIST_ID, courseLevelSuggestions } from "../../../shared/lib/courseLevelOptions";
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
    if (!name || !level || !driveUrl.trim() || !materialDescription.trim()) return;
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

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border bg-white p-4">
      <h2 className="text-lg font-semibold">Nueva solicitud GIF</h2>
      <input
        type="text"
        className="w-full rounded border border-slate-300 p-2"
        placeholder="Nombre de la materia"
        value={courseName}
        onChange={(event) => setCourseName(event.target.value)}
        autoComplete="off"
      />
      <div>
        <input
          type="text"
          className="w-full rounded border border-slate-300 p-2"
          placeholder="Tipo de materia"
          list={COURSE_LEVEL_DATALIST_ID}
          value={courseLevelType}
          onChange={(event) => setCourseLevelType(event.target.value)}
          autoComplete="off"
        />
        <datalist id={COURSE_LEVEL_DATALIST_ID}>
          {courseLevelSuggestions.map((value) => (
            <option key={value} value={value} />
          ))}
        </datalist>
      </div>
      <input
        className="w-full rounded border border-slate-300 p-2"
        placeholder="Enlace de Google Drive"
        value={driveUrl}
        onChange={(event) => setDriveUrl(event.target.value)}
      />
      <textarea
        className="w-full rounded border border-slate-300 p-2"
        placeholder="Descripcion del material"
        value={materialDescription}
        onChange={(event) => setMaterialDescription(event.target.value)}
      />
      <button type="submit" className="rounded bg-slate-900 px-3 py-2 text-white">
        Enviar solicitud
      </button>
    </form>
  );
}
