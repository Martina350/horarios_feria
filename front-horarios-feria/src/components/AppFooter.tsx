import logoclearminds from '../assets/logoclearminds.png';
import logokrakedev from '../assets/logokrakedev.png';
import logomichi from '../assets/logomichi.png';

/**
 * Footer global: público y admin.
 * Diseño minimalista e institucional.
 */
export function AppFooter() {
  return (
    <footer className="mt-auto py-3 sm:py-4 bg-slate-100/30 backdrop-blur-sm border-t border-slate-200">
      <p className="text-center text-slate-500 text-xs sm:text-sm font-myriad flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span>© Elaborado por</span>
        <span className="inline-flex items-center gap-3">
          <img src={logoclearminds} alt="Clearminds" className="h-7 sm:h-7 w-auto object-contain" />
          <img src={logokrakedev} alt="Krakedev" className="h-7 sm:h-7 w-auto object-contain" />
          <img src={logomichi} alt="Michi Money" className="h-7 sm:h-7 w-auto object-contain" />
        </span>
      </p>
    </footer>
  );
}
