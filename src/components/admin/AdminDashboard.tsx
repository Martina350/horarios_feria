import { useState } from 'react'
import type { EventDay, SchoolReservation } from '../../data/eventData'
import { MetricsCards } from './MetricsCards'
// import { AlertsPanel } from './AlertsPanel'
import { ChartsSection } from './ChartsSection'
import { SchoolsTable } from './SchoolsTable'
import { EditReservationModal } from './EditReservationModal'

type AdminDashboardProps = {
  days: EventDay[]
  onUpdateDays: (updatedDays: EventDay[]) => void
  onBack: () => void
}

export function AdminDashboard({ days, onUpdateDays, onBack }: AdminDashboardProps) {
  const [editingReservation, setEditingReservation] = useState<SchoolReservation | null>(null)

  const handleEdit = (reservation: SchoolReservation) => {
    setEditingReservation(reservation)
  }

  const handleDelete = (reservationId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      return
    }

    const updatedDays = days.map((day) => ({
      ...day,
      slots: day.slots.map((slot) => {
        const reservation = slot.schools.find((s) => s.id === reservationId)
        if (reservation) {
          return {
            ...slot,
            schools: slot.schools.filter((s) => s.id !== reservationId),
            available: slot.available + reservation.students,
          }
        }
        return slot
      }),
    }))

    onUpdateDays(updatedDays)
  }

  const handleSaveEdit = (updatedReservation: SchoolReservation) => {
    // Buscar la reserva original
    let oldReservation: SchoolReservation | null = null
    let foundDayId = ''
    let foundSlotId = ''

    for (const day of days) {
      for (const slot of day.slots) {
        const reservation = slot.schools.find((s) => s.id === updatedReservation.id)
        if (reservation) {
          oldReservation = reservation
          foundDayId = day.id
          foundSlotId = slot.id
          break
        }
      }
      if (oldReservation) break
    }

    if (!oldReservation) return

    const studentsDiff = updatedReservation.students - oldReservation.students

    // Si cambió el día u horario, mover la reserva
    if (
      oldReservation.dayId !== updatedReservation.dayId ||
      oldReservation.slotId !== updatedReservation.slotId
    ) {
      // Remover del slot original y agregar al nuevo
      const updatedDays = days.map((day) => {
        // Remover del slot original
        if (day.id === foundDayId) {
          return {
            ...day,
            slots: day.slots.map((slot) => {
              if (slot.id === foundSlotId) {
                return {
                  ...slot,
                  schools: slot.schools.filter((s) => s.id !== updatedReservation.id),
                  available: slot.available + oldReservation.students,
                }
              }
              return slot
            }),
          }
        }
        // Agregar al nuevo slot
        if (day.id === updatedReservation.dayId) {
          return {
            ...day,
            slots: day.slots.map((slot) => {
              if (slot.id === updatedReservation.slotId) {
                return {
                  ...slot,
                  schools: [...slot.schools, updatedReservation],
                  available: slot.available - updatedReservation.students,
                }
              }
              return slot
            }),
          }
        }
        return day
      })

      onUpdateDays(updatedDays)
      setEditingReservation(null)
      return
    }

    // Actualizar en el mismo slot
    const updatedDays = days.map((day) => {
      if (day.id === foundDayId) {
        return {
          ...day,
          slots: day.slots.map((slot) => {
            if (slot.id === foundSlotId) {
              const index = slot.schools.findIndex((s) => s.id === updatedReservation.id)
              if (index !== -1) {
                const newSchools = [...slot.schools]
                newSchools[index] = updatedReservation
                return {
                  ...slot,
                  schools: newSchools,
                  available: slot.available - studentsDiff,
                }
              }
            }
            return slot
          }),
        }
      }
      return day
    })

    onUpdateDays(updatedDays)
    setEditingReservation(null)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header className="bg-[#1f4b9e] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Volver a vista pública"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-sm text-white/80">Global Money Week - Gestión de Reservas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="container mx-auto px-4 py-8">
        {/* Métricas generales */}
        <MetricsCards days={days} />

        {/* Alertas */}
        {/* <AlertsPanel days={days} /> */}

        {/* Gráficos */}
        <div className="mb-6">
          {typeof window !== 'undefined' && (
            <ChartsSection days={days} />
          )}
        </div>

        {/* Tabla de colegios */}
        <SchoolsTable
          days={days}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modal de edición */}
        {editingReservation && (
          <EditReservationModal
            reservation={editingReservation}
            days={days}
            onClose={() => setEditingReservation(null)}
            onSave={handleSaveEdit}
          />
        )}
      </main>
    </div>
  )
}
