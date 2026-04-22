import type { ReactNode } from "react";
import type { UserRole } from "../../shared/types/domain";
import { DASHBOARD_HERO_CONTENT_MIN_PX } from "../scene/sceneConstants";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import type { SiteHeroVariant } from "./SiteHero";
import { SiteHero } from "./SiteHero";

interface SiteShellProps {
  heroVariant?: SiteHeroVariant;
  headerActions?: ReactNode;
  navRole: UserRole;
  /** Hero/footer sin fondo opaco para alinear con paneles de `AppSceneLayout`. */
  integratedScene?: boolean;
  children: ReactNode;
}

/**
 * Estructura de página: header → hero → contenido (tarjetas, formularios) → footer.
 * El bloque central crece para empujar el footer al final en pantallas altas.
 */
export function SiteShell({
  heroVariant = "gif",
  headerActions,
  navRole,
  integratedScene = false,
  children,
}: SiteShellProps) {
  const opaque = !integratedScene;

  return (
    <div className={`flex min-h-screen flex-col ${integratedScene ? "bg-transparent" : "bg-slate-50/80"}`}>
      <SiteHeader navRole={navRole} actions={headerActions} />
      <div className="relative z-10 flex flex-1 flex-col">
        <SiteHero
          variant={heroVariant}
          opaqueBackground={opaque}
          minContentHeightPx={integratedScene ? DASHBOARD_HERO_CONTENT_MIN_PX : undefined}
          compactVertical={integratedScene}
        />
        <div className="flex flex-1 flex-col justify-center">
          <div
            className={`mx-auto w-full max-w-6xl px-4 py-8 ${
              integratedScene ? "bg-transparent" : "bg-slate-50/90"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
      <SiteFooter opaqueBackground={opaque} />
    </div>
  );
}
