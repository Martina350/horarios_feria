import type { EventDay, TimeSlot } from "../data/eventData";

type DayCardProps = {
  day: EventDay;
  onReserveClick: (slot: TimeSlot) => void;
};

function getAvailabilityColor(available: number) {
  if (available > 100) return "bg-[#e6f7d9] text-[#2c7a1f]";
  if (available >= 50) return "bg-[#fff4d2] text-[#d88700]";
  return "bg-[#ffe3e3] text-[#c53030]";
}

function getAvailabilityLabel(available: number) {
  if (available > 100) return "Muchos cupos";
  if (available >= 50) return "Pocos cupos";
  return "Casi lleno";
}

function getBorderColor(available: number) {
  if (available > 100) return "border-[#d3f0c2]";
  if (available >= 50) return "border-[#ffe3a3]";
  return "border-[#ffb3b3]";
}

export function DayCard({ day, onReserveClick }: DayCardProps) {
  return (
    <section className="card-day">
      <header className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#1f4b9e] text-white text-xs font-semibold shadow-sm">
          {day.day.split(" ")[0][0]}
        </span>
        <h2 className="text-sm font-semibold tracking-[0.16em] text-[#1f4b9e] uppercase">
          {day.day}
        </h2>
      </header>

      <div className="grid gap-4">
        {day.slots.map((slot) => {
          const availabilityColor = getAvailabilityColor(slot.available);
          const availabilityLabel = getAvailabilityLabel(slot.available);
          const borderColor = getBorderColor(slot.available);
          const isFull = slot.available === 0;

          return (
            <article
              key={slot.id}
              className={`card-slot border-2 ${borderColor} max-w-[360px] mx-auto`}
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-[#6c757d] uppercase tracking-[0.2em]">
                      Horario
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#1f4b9e] leading-none">
                        {slot.time.split(" ")[0]}
                      </span>
                      <span className="text-xs text-[#6c757d]">
                        hasta las {slot.time.split("-")[1]?.trim()}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${availabilityColor}`}>
                    <span className="h-2 w-2 rounded-full bg-current mr-1.5" />
                    {availabilityLabel.toUpperCase()}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-xs md:text-sm text-[#6c757d]">
                  <div>
                    <dt className="font-medium text-[#2c3e50]">
                      Capacidad total
                    </dt>
                    <dd>
                      <span className="font-semibold text-[#1f4b9e]">
                        {slot.capacity}
                      </span>{" "}
                      alumnos
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[#2c3e50]">Cupos libres</dt>
                    <dd>
                      <span className="font-semibold text-[#1f4b9e]">
                        {slot.available}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-2">
                  <p className="text-xs font-semibold text-[#6c757d] uppercase tracking-wide mb-1">
                    Inscritos ({slot.schools.length})
                  </p>
                  {slot.schools.length === 0 ? (
                    <p className="text-sm text-[#b0b8c4] italic">
                      No hay colegios inscritos en este horario.
                    </p>
                  ) : (
                    <ul className="space-y-1 rounded-2xl bg-white/80 border border-[#e9ecef] px-3 py-2">
                      {slot.schools.map((school) => (
                        <li
                          key={`${school.amie}-${school.schoolName}`}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="font-medium text-[#2c3e50]">
                            {school.schoolName}
                          </span>
                          <span className="text-[#6c757d]">
                            {school.students} estudiantes
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    className="btn-primary w-full md:w-40"
                    disabled={isFull}
                    onClick={() => onReserveClick(slot)}
                  >
                    {isFull ? "Sin cupos disponibles" : "Reservar ahora"}
                  </button>
                </div>
              </div>
              <div className="mt-3 md:mt-0 md:ml-4 flex flex-col items-stretch md:items-end gap-2">
                {isFull && (
                  <span className="text-xs text-[#c53030] text-right">
                    Este horario ha alcanzado su capacidad máxima.
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
