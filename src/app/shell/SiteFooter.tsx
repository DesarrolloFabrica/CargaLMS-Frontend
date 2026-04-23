interface SiteFooterProps {
  /** Si false, sin fondo blanco (deja ver el bloque inferior de la escena). */
  opaqueBackground?: boolean;
}

export function SiteFooter({ opaqueBackground = true }: SiteFooterProps) {
  const year = new Date().getFullYear();

  const surfaceClass = opaqueBackground
    ? "mt-auto border-t border-slate-200 bg-white"
    : "mt-auto border-0 bg-transparent shadow-none";
  const textClass = opaqueBackground ? "text-slate-500" : "text-slate-100";
  const brandClass = opaqueBackground ? "text-slate-700" : "text-white";
  const metaClass = opaqueBackground ? "text-slate-400" : "text-slate-200";

  return (
    <footer className={surfaceClass}>
      <div className={`mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-center text-sm sm:flex-row sm:text-left ${textClass}`}>
        <p>
          <span className={`font-semibold ${brandClass}`}>Carga LMS</span> · Flujo GIF ↔ Coordinador
        </p>
        <p className={metaClass}>© {year} · Versión MVP</p>
      </div>
    </footer>
  );
}