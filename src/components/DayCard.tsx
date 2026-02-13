import type { EventDay, TimeSlot } from "../data/eventData";

type DayCardProps = {
  day: EventDay;
  onReserveClick: (slot: TimeSlot) => void;
};

function getStatusStyles(available: number) {
  if (available > 100) {
    return {
      label: "DISPONIBLE",
      chipClass:
        "bg-emerald-50 text-emerald-600 border border-emerald-100",
      valueClass: "text-[#16a34a]",
      cardAccentClass: "",
    };
  }

  if (available >= 50) {
    return {
      label: "MEDIA",
      chipClass: "bg-amber-50 text-amber-600 border border-amber-100",
      valueClass: "text-[#f59e0b]",
      cardAccentClass: "",
    };
  }

  return {
    label: "LIMITADA",
    chipClass: "bg-red-50 text-red-600 border border-red-100",
    valueClass: "text-[#e11d48]",
    cardAccentClass: "border-l-4 border-l-[#e11d48]",
  };
}

export function DayCard({ day, onReserveClick }: DayCardProps) {
  return (
    <section className="space-y-6">
      <header className="flex items-center gap-3 px-2 mb-1">
        <div className="w-10 h-10 rounded-xl bg-[#1f4b9e] flex items-center justify-center text-white">
          <span className="material-symbols-outlined">calendar_month</span>
        </div>
        <h2 className="text-xl font-extrabold text-[#1f4b9e] uppercase tracking-tight">
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
              className={`bg-white rounded-[2rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 group max-w-[380px] mx-auto ${cardAccentClass}`}
            >
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-3xl font-black text-[#1f4b9e] leading-none">
                      {startDisplay}
                    </p>
                    <p className="text-sm font-bold text-slate-400 mt-1">
                      hasta las {rawEnd}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${chipClass}`}
                  >
                    {label}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-500 font-medium">
                      Capacidad Total
                    </span>
                    <span className="font-bold text-[#1f4b9e]">
                      {slot.capacity} alumnos
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">
                      Cupos Libres
                    </span>
                    <span className={`text-xl font-black ${valueClass}`}>
                      {slot.available}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
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
                </div>

                <button
                  type="button"
                  className="w-full bg-[#ffd000] hover:bg-[#e6bc00] text-[#1f4b9e] py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-yellow-200/50 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isFull}
                  onClick={() => onReserveClick(slot)}
                >
                  {isFull ? "Sin cupos disponibles" : "Reservar ahora"}
                </button>
              </div>
              {isFull && (
                <p className="mt-2 text-xs text-[#c53030] font-medium">
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
