export type SiteHeroVariant = "gif" | "coordinator";

interface SiteHeroProps {
  variant?: SiteHeroVariant;
  /** Si false, sin fondo propio (deja ver el bloque superior de la escena). */
  opaqueBackground?: boolean;
  /**
   * Altura mínima del bloque hero (px), alineada con `DASHBOARD_HERO_CONTENT_MIN_PX` en `sceneConstants`
   * para que el fondo animado final coincida con el contenido.
   */
  minContentHeightPx?: number;
  /** Menos padding vertical cuando el hero va integrado con la escena. */
  compactVertical?: boolean;
}

const copy: Record<
  SiteHeroVariant,
  { eyebrow: string; title: string; description: string }
> = {
  gif: {
    eyebrow: "Operaciones académicas",
    title: "Ordena la carga de material hacia el LMS",
    
  },
  coordinator: {
    eyebrow: "Bandeja de coordinación",
    title: "Gestiona las solicitudes de carga al LMS",
  },
};

export function SiteHero({
  variant = "gif",
  opaqueBackground = true,
  minContentHeightPx,
  compactVertical = false,
}: SiteHeroProps) {
  const { eyebrow, title, description } = copy[variant];

  const surfaceClass = opaqueBackground
    ? "border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/60"
    : "bg-transparent";

  const paddingClass = compactVertical ? "py-8 sm:py-10 md:py-11" : "py-10 sm:py-12 md:py-14";

  return (
    <section
      className={surfaceClass}
      aria-labelledby="hero-heading"
      style={minContentHeightPx ? { minHeight: minContentHeightPx } : undefined}
    >
      <div className={`mx-auto max-w-6xl px-4 ${paddingClass}`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 sm:text-sm">{eyebrow}</p>
        <h1
          id="hero-heading"
          className="mt-2 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl md:text-4xl"
        >
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">{description}</p>
      </div>
    </section>
  );
}
