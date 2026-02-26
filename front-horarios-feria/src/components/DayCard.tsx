import type { EventDay, TimeSlot } from "../data/eventData";

type DayCardProps = {
  day: EventDay;
  onReserveClick: (slot: TimeSlot, dayId: string) => void;
  onShowConfirmedClick?: (slot: TimeSlot, dayId: string) => void;
};

function getStatusStyles(available: number) {
  if (available > 100) {
    return {
      label: "DISPONIBLE",
      chipClass:
        "bg-secondary/20 text-secondary border border-secondary/30",
      valueClass: "text-secondary",
      cardAccentClass: "",
    };
  }

  if (available >= 50) {
    return {
      label: "MEDIA",
      chipClass: "bg-accent/20 text-accent-dark border border-accent/30",
      valueClass: "text-accent-dark",
      cardAccentClass: "",
    };
  }

  return {
    label: "LIMITADA",
    chipClass: "bg-red-50 text-red-600 border border-red-200",
    valueClass: "text-red-600",
    cardAccentClass: "border-l-4 border-l-red-500",
  };
}

export function DayCard({ day, onReserveClick, onShowConfirmedClick }: DayCardProps) {
  return (
    <section className="space-y-6">
      <header className="flex items-center gap-3 px-0 mb-1 rounded-xl bg-[#A72974] text-white shadow-md overflow-hidden">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-2xl">calendar_month</span>
        </div>
        <h2 className="text-xl uppercase tracking-tight font-childhood py-3 pr-4 flex-1">
          {day.day}
        </h2>
      </header>

      <div className="space-y-6">
        {day.slots.map((slot) => {
          const { label, chipClass, valueClass, cardAccentClass } =
            getStatusStyles(slot.available);
          const isFull = slot.available === 0;

          const [rawStart, rawEnd] = slot.time.split("-").map((v) => v.trim());
          const startDisplay = rawStart.replace("h", ":");

          return (
            <article
              key={slot.id}
              className={`bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-200 p-4 sm:p-6 group w-full max-w-[380px] mx-auto ${cardAccentClass}`}
            >
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-3xl font-black text-primary leading-none font-childhood">
                      {startDisplay}
                    </p>
                    <p className="text-sm font-bold text-slate-400 mt-1 font-myriad">
                      hasta las {rawEnd}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-gothic ${chipClass}`}
                  >
                    {label}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 gap-4">
                    <span className="text-slate-500 font-medium font-myriad">
                      Capacidad Total
                    </span>
                    <span className="font-bold text-support whitespace-nowrap font-gothic">
                      {slot.capacity} alumnos
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm gap-4">
                    <span className="text-slate-500 font-medium font-myriad">
                      Cupos disponibles
                    </span>
                    <span className={`text-xl font-black ${valueClass} whitespace-nowrap font-gothic`}>
                      {slot.available}/{slot.capacity}
                    </span>
                  </div>
                </div>

                {/*<div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">
                    {slot.schools.length === 0
                      ? "Inscritos"
                      : `Inscritos (${slot.schools.length})`}
                  </p>
                  {slot.schools.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      No hay registros aún
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {slot.schools.map((school) => (
                        <div
                          key={`${school.amie}-${school.schoolName}`}
                          className="flex items-center gap-2 text-xs font-bold text-slate-600"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1f4b9e]" />
                          <span>{school.schoolName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>*/}

                <button
                  type="button"
                  className="w-full bg-[#006837] hover:bg-[#005229] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#006837]/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 font-childhood active:scale-95"
                  disabled={isFull}
                  onClick={() => onReserveClick(slot, day.id)}
                >
                  {isFull ? "Sin cupos disponibles" : "Reservar ahora"}
                </button>
                {onShowConfirmedClick && (
                  <button
                    type="button"
                    onClick={() => onShowConfirmedClick(slot, day.id)}
                    className="w-full mt-3 text-sm font-medium text-secondary hover:text-primary-hover transition-all duration-200 font-myriad underline underline-offset-2"
                  >
                    Mostrar instituciones confirmadas
                  </button>
                )}
              </div>
              {isFull && (
                <p className="mt-2 text-xs text-red-600 font-medium font-myriad">
                  Este horario ha alcanzado su capacidad máxima.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
