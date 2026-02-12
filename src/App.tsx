import { useState } from 'react'
import { initialEventData, type EventDay, type SchoolReservation, type TimeSlot } from './data/eventData'
import { DayCard } from './components/DayCard'
import { ReservationModal } from './components/ReservationModal'

function App() {
  const [days, setDays] = useState<EventDay[]>(initialEventData)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenReservation = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSlot(null)
  }

  const handleConfirmReservation = (reservation: SchoolReservation) => {
    if (!selectedSlot) return

    setDays((prevDays) =>
      prevDays.map((day) => ({
        ...day,
        slots: day.slots.map((slot) => {
          if (slot.id === selectedSlot.id && day.slots.includes(selectedSlot)) {
            // Actualizamos la lista de colegios y los cupos disponibles
            return {
              ...slot,
              schools: [...slot.schools, reservation],
              available: slot.available - reservation.students,
            }
          }
          return slot
        }),
      })),
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#1f4b9e] text-white shadow-lg">
        <div className="container-page py-4 md:py-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg tracking-tight">
                GM
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Global Money Week
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
                  Centro de Exposiciones Quito
                </h1>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
              <button className="hover:text-white transition-colors">Inicio</button>
              <button className="hover:text-white transition-colors">Beneficios</button>
              <button className="hover:text-white transition-colors">Soporte</button>
            </nav>
          </div>

          <div className="mt-2 bg-white/10 backdrop-blur rounded-2xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs md:text-sm font-medium flex items-center gap-2">
                Disponibilidad de horarios
              </p>
              <p className="text-xs md:text-sm text-white/80">
                Selecciona tu franja horaria para asistir a Global Money Week en el Centro de
                Exposiciones Quito.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] md:text-xs">
              <span className="badge bg-[#e6f7d9] text-[#2c7a1f]">
                <span className="h-2 w-2 rounded-full bg-[#2c7a1f] mr-1.5" />
                Alta (&gt; 100)
              </span>
              <span className="badge bg-[#fff4d2] text-[#d88700]">
                <span className="h-2 w-2 rounded-full bg-[#d88700] mr-1.5" />
                Media (50–100)
              </span>
              <span className="badge bg-[#ffe3e3] text-[#c53030]">
                <span className="h-2 w-2 rounded-full bg-[#c53030] mr-1.5" />
                Baja (&lt; 50)
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container-page space-y-6 flex-1">
        <p className="text-sm md:text-base text-[#6c757d] max-w-3xl">
          Visualiza la disponibilidad de cupos por día y horario, y realiza la reserva de tu unidad
          educativa de manera rápida y segura. Cada franja cuenta con una capacidad máxima de{' '}
          <span className="font-semibold text-[#1f4b9e]">200 estudiantes</span>.
        </p>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {days.map((day) => (
            <DayCard key={day.id} day={day} onReserveClick={handleOpenReservation} />
          ))}
        </div>
      </main>

      <ReservationModal
        isOpen={isModalOpen}
        slot={selectedSlot}
        onClose={handleCloseModal}
        onConfirm={handleConfirmReservation}
      />
    </div>
  )
}

export default App
