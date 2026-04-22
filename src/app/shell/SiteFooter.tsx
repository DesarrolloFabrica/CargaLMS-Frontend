interface SiteFooterProps {
  /** Si false, sin fondo blanco (deja ver el bloque inferior de la escena). */
  opaqueBackground?: boolean;
}

export function SiteFooter({ opaqueBackground = true }: SiteFooterProps) {
  const year = new Date().getFullYear();

  const surfaceClass = opaqueBackground ? "mt-auto border-t border-slate-200 bg-white" : "mt-auto bg-transparent";

  return (
    <footer className={surfaceClass}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
        <p>
          <span className="font-semibold text-slate-700">Carga LMS</span> · Flujo GIF ↔ Coordinador
        </p>
        <p className="text-slate-400">© {year} · Versión MVP</p>
      </div>
    </footer>
  );
}
