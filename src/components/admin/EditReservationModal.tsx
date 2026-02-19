import { useState, useEffect } from 'react'
import type { SchoolReservation, EventDay } from '../../data/eventData'

type EditReservationModalProps = {
  reservation: SchoolReservation
  days: EventDay[]
  onClose: () => void
  onSave: (reservation: SchoolReservation) => void
}

export function EditReservationModal({
  reservation,
  days,
  onClose,
  onSave,
}: EditReservationModalProps) {
  const [form, setForm] = useState({
    amie: reservation.amie,
    schoolName: reservation.schoolName,
    coordinatorName: reservation.coordinatorName,
    email: reservation.email,
    whatsapp: reservation.whatsapp,
    students: reservation.students.toString(),
    dayId: reservation.dayId,
    slotId: reservation.slotId,
    status: reservation.status,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setForm({
      amie: reservation.amie,
      schoolName: reservation.schoolName,
      coordinatorName: reservation.coordinatorName,
      email: reservation.email,
      whatsapp: reservation.whatsapp,
      students: reservation.students.toString(),
      dayId: reservation.dayId,
      slotId: reservation.slotId,
      status: reservation.status,
    })
  }, [reservation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!form.amie.trim()) newErrors.amie = 'El código AMIE es obligatorio.'
    if (!form.schoolName.trim()) newErrors.schoolName = 'El nombre del colegio es obligatorio.'
    if (!form.coordinatorName.trim())
      newErrors.coordinatorName = 'El nombre del coordinador es obligatorio.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'El correo electrónico es obligatorio y debe ser válido.'
    }
    if (!form.whatsapp.trim() || form.whatsapp.length !== 10) {
      newErrors.whatsapp = 'El número de WhatsApp debe tener 10 dígitos.'
    }

    const studentsNumber = Number(form.students)
    if (Number.isNaN(studentsNumber) || studentsNumber <= 0) {
      newErrors.students = 'El número de estudiantes debe ser mayor a 0.'
    }

    // Verificar disponibilidad del nuevo slot si cambió
    if (form.dayId !== reservation.dayId || form.slotId !== reservation.slotId) {
      const selectedDay = days.find((d) => d.id === form.dayId)
      const selectedSlot = selectedDay?.slots.find((s) => s.id === form.slotId)
      if (selectedSlot && selectedSlot.available < studentsNumber) {
        newErrors.students = `Solo hay ${selectedSlot.available} cupos disponibles en este horario.`
      }
    } else {
      // Si es el mismo slot, verificar disponibilidad considerando la reserva actual
      const selectedDay = days.find((d) => d.id === form.dayId)
      const selectedSlot = selectedDay?.slots.find((s) => s.id === form.slotId)
      if (selectedSlot) {
        const currentStudents = reservation.students
        const availableWithCurrent = selectedSlot.available + currentStudents
        if (availableWithCurrent < studentsNumber) {
          newErrors.students = `Solo hay ${availableWithCurrent} cupos disponibles.`
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const updatedReservation: SchoolReservation = {
      ...reservation,
      amie: form.amie.trim(),
      schoolName: form.schoolName.trim(),
      coordinatorName: form.coordinatorName.trim(),
      email: form.email.trim().toLowerCase(),
      whatsapp: form.whatsapp.trim(),
      students: studentsNumber,
      dayId: form.dayId,
      slotId: form.slotId,
      status: form.status as 'confirmada' | 'pendiente' | 'cancelada',
    }

    onSave(updatedReservation)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1f4b9e] text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">Editar Reserva</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: '#2c3e50' }}>
                Código AMIE
              </label>
              <input
                type="text"
                value={form.amie}
                onChange={(e) => setForm({ ...form, amie: e.target.value })}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                style={{ border: '1px solid #e9ecef' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1f4b9e'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(31, 75, 158, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {errors.amie && <p className="text-xs mt-1" style={{ color: '#dc3545' }}>{errors.amie}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: '#2c3e50' }}>
                Nombre del Colegio
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                style={{ border: '1px solid #e9ecef' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1f4b9e'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(31, 75, 158, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {errors.schoolName && (
                <p className="text-xs mt-1" style={{ color: '#dc3545' }}>{errors.schoolName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: '#2c3e50' }}>
                Coordinador
              </label>
              <input
                type="text"
                value={form.coordinatorName}
                onChange={(e) => setForm({ ...form, coordinatorName: e.target.value })}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                style={{ border: '1px solid #e9ecef' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1f4b9e'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(31, 75, 158, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {errors.coordinatorName && (
                <p className="text-xs mt-1" style={{ color: '#dc3545' }}>{errors.coordinatorName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: '#2c3e50' }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                style={{ border: '1px solid #e9ecef' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1f4b9e'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(31, 75, 158, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#dc3545' }}>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: '#2c3e50' }}>WhatsApp</label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) =>
                  setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 10) })
                }
                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                style={{ border: '1px solid #e9ecef' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1f4b9e'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(31, 75, 158, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {errors.whatsapp && (
                <p className="text-xs mt-1" style={{ color: '#dc3545' }}>{errors.whatsapp}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: '#2c3e50' }}>Estudiantes</label>
              <input
                type="number"
                min={1}
                value={form.students}
                onChange={(e) => setForm({ ...form, students: e.target.value })}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                style={{ border: '1px solid #e9ecef' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1f4b9e'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(31, 75, 158, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {errors.students && (
                <p className="text-xs mt-1" style={{ color: '#dc3545' }}>{errors.students}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: '#2c3e50' }}>Día</label>
              <select
                value={form.dayId}
                onChange={(e) => setForm({ ...form, dayId: e.target.value })}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                style={{ border: '1px solid #e9ecef' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1f4b9e'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(31, 75, 158, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {days.map((day) => (
                  <option key={day.id} value={day.id}>
                    {day.day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: '#2c3e50' }}>Horario</label>
              <select
                value={form.slotId}
                onChange={(e) => setForm({ ...form, slotId: e.target.value })}
                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                style={{ border: '1px solid #e9ecef' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1f4b9e'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(31, 75, 158, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {days
                  .find((d) => d.id === form.dayId)
                  ?.slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.time} ({slot.available} disponibles)
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: '#2c3e50' }}>Estado</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as 'confirmada' | 'pendiente' | 'cancelada',
                  })
                }
                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                style={{ border: '1px solid #e9ecef' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1f4b9e'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(31, 75, 158, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4" style={{ borderTop: '1px solid #e9ecef' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 font-bold rounded-xl transition-colors"
              style={{ color: '#6c757d' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white font-bold rounded-xl transition-colors"
              style={{ backgroundColor: '#1f4b9e' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4c96cc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1f4b9e')}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
