import { useEffect, useCallback } from 'react';
import { useConfirmedInstitutions } from '../hooks/useConfirmedInstitutions';

type ConfirmedInstitutionsModalProps = {
  isOpen: boolean;
  slotId: string | null;
  dayLabel: string;
  slotTime: string;
  onClose: () => void;
};

export function ConfirmedInstitutionsModal({
  isOpen,
  slotId,
  dayLabel,
  slotTime,
  onClose,
}: ConfirmedInstitutionsModalProps) {
  const { data, isLoading, isError } = useConfirmedInstitutions(isOpen ? slotId : null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const institutions = data?.institutions ?? [];
  const totalSchools = institutions.length;
  const totalStudents = institutions.reduce((sum, i) => sum + i.students, 0);

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmed-institutions-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col animate-[scaleIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2
              id="confirmed-institutions-title"
              className="text-lg font-bold text-slate-800 font-childhood uppercase tracking-widest"
            >
              Instituciones confirmadas
            </h2>
            <p className="text-sm text-slate-500 font-myriad mt-0.5">
              {dayLabel} · {slotTime}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
            </div>
          )}

          {isError && (
            <p className="text-center text-slate-500 font-myriad py-8">
              No se pudo cargar la información. Intenta de nuevo.
            </p>
          )}

          {!isLoading && !isError && institutions.length === 0 && (
            <p className="text-center text-slate-500 font-myriad py-8">
              Aún no hay instituciones confirmadas para este horario.
            </p>
          )}

          {!isLoading && !isError && institutions.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-primary/10 rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl font-black text-primary font-gothic">{totalSchools}</p>
                  <p className="text-xs font-medium text-slate-600 font-myriad">
                    Instituciones confirmadas
                  </p>
                </div>
                <div className="bg-secondary/10 rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl font-black text-secondary font-gothic">{totalStudents}</p>
                  <p className="text-xs font-medium text-slate-600 font-myriad">
                    Estudiantes confirmados
                  </p>
                </div>
              </div>

              <ul className="space-y-3">
                {institutions.map((inst, index) => (
                  <li
                    key={`${inst.schoolName}-${index}`}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-slate-800 font-myriad truncate">
                      {inst.schoolName}
                    </span>
                    <span className="text-secondary font-bold text-sm font-gothic whitespace-nowrap">
                      {inst.students} estudiantes
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-200 font-gothic"
          >
            Cerrar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
