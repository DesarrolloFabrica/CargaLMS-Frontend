import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import type { UserRole } from "../../shared/types/domain";
import {
  HERO_HEADER_COLOR,
  WAVE_PAPER_TEXTURE_BLEND_MODE,
  WAVE_PAPER_TEXTURE_SIZE,
  WAVE_PAPER_TEXTURE_URL,
  WAVE_FRONT_TEXTURE_POSITION,
} from "../theme/surfaceColors";

interface SiteHeaderProps {
  /** Contenido a la derecha: notificaciones, cerrar sesion, etc. */
  actions?: ReactNode;
  /** Solo enlaces del rol actual (no mezclar flujos sin re-login). */
  navRole: UserRole;
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-2 py-1 text-sm font-medium ${
    isActive
      ? "border border-white bg-white text-slate-900"
      : "border border-transparent text-slate-100 hover:border-slate-300/60 hover:text-white"
  }`;

export function SiteHeader({ actions, navRole }: SiteHeaderProps) {
  const homeHref = navRole === "GIF" ? "/" : "/coordinator";

  return (
    <header
      className="sticky top-0 z-20 border-b border-slate-500/40"
      style={{
        backgroundColor: HERO_HEADER_COLOR,
        backgroundImage: `url('${WAVE_PAPER_TEXTURE_URL}')`,
        backgroundRepeat: "repeat",
        backgroundSize: WAVE_PAPER_TEXTURE_SIZE,
        backgroundPosition: WAVE_FRONT_TEXTURE_POSITION,
        backgroundBlendMode: WAVE_PAPER_TEXTURE_BLEND_MODE,
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <Link to={homeHref} className="text-lg font-semibold text-white">
            Carga LMS
          </Link>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2" aria-label="Principal">
            {navRole === "GIF" ? (
              <NavLink to="/" end className={navClass}>
                Area GIF
              </NavLink>
            ) : (
              <NavLink to="/coordinator" end className={navClass}>
                Coordinador
              </NavLink>
            )}
          </nav>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div> : null}
      </div>
    </header>
  );
}
