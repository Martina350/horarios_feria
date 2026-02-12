import type { SchoolReservation, TimeSlot } from '../data/eventData'
import { useEffect, useState } from 'react'

type ReservationModalProps = {
  isOpen: boolean
  slot: TimeSlot | null
  onClose: () => void
  onConfirm: (values: SchoolReservation) => void
}

type FormState = {
  amie: string
  schoolName: string
  coordinatorName: string
  coordinatorLastName: string
  whatsapp: string
  students: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = {
  amie: '',
  schoolName: '',
  coordinatorName: '',
  coordinatorLastName: '',
  whatsapp: '',
  students: '',
}

export function ReservationModal({ isOpen, slot, onClose, onConfirm }: ReservationModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm)
      setError(null)
      setFieldErrors({})
    }
  }, [isOpen])

  if (!isOpen || !slot) return null

  const handleChange = (field: keyof FormState, rawValue: string) => {
    let value = rawValue

    // No permitir espacios en todos los campos excepto nombre del colegio y número de alumnos
    if (field !== 'schoolName' && field !== 'students') {
      value = value.replace(/\s+/g, '')
    }

    // Reglas específicas por campo
    if (field === 'whatsapp') {
      // Solo números y máximo 10 dígitos
      value = value.replace(/\D/g, '').slice(0, 10)
    }

    if (field === 'amie') {
      // Solo alfanumérico, máximo 10 caracteres
      value = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)
    }

    if (field === 'coordinatorName' || field === 'coordinatorLastName') {
      // Máximo 50 caracteres para nombres y apellidos
      value = value.slice(0, 50)
    }

    // Limpiar error específico del campo al modificarlo
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const newFieldErrors: FieldErrors = {}

    const amieTrimmed = form.amie.trim()
    const whatsappTrimmed = form.whatsapp.trim()

    if (!amieTrimmed) newFieldErrors.amie = 'El código AMIE es obligatorio.'
    if (amieTrimmed && (amieTrimmed.length < 8 || amieTrimmed.length > 10)) {
      newFieldErrors.amie =
        'El código AMIE debe tener entre 8 y 10 caracteres alfanuméricos.'
    }
    if (amieTrimmed && /[^a-zA-Z0-9]/.test(amieTrimmed)) {
      newFieldErrors.amie = 'El código AMIE solo puede contener letras y números.'
    }

    if (!form.schoolName.trim()) newFieldErrors.schoolName = 'El nombre del colegio es obligatorio.'
    if (!form.coordinatorName.trim()) newFieldErrors.coordinatorName = 'El nombre del coordinador es obligatorio.'
    if (!form.coordinatorLastName.trim()) newFieldErrors.coordinatorLastName =
      'El apellido del coordinador es obligatorio.'
    if (form.coordinatorName && form.coordinatorName.length > 50) {
      newFieldErrors.coordinatorName = 'El nombre del coordinador no puede superar 50 caracteres.'
    }
    if (form.coordinatorLastName && form.coordinatorLastName.length > 50) {
      newFieldErrors.coordinatorLastName =
        'El apellido del coordinador no puede superar 50 caracteres.'
    }

    if (!whatsappTrimmed) newFieldErrors.whatsapp = 'El número de WhatsApp es obligatorio.'
    if (whatsappTrimmed && !/^\d+$/.test(whatsappTrimmed)) {
      newFieldErrors.whatsapp = 'El número de WhatsApp solo puede contener dígitos.'
    }
    if (whatsappTrimmed && whatsappTrimmed.length !== 10) {
      newFieldErrors.whatsapp = 'El número de WhatsApp debe tener exactamente 10 dígitos.'
    }
    if (!form.students.trim()) newFieldErrors.students = 'El número de alumnos es obligatorio.'

    const studentsNumber = Number(form.students)

    if (Number.isNaN(studentsNumber) || studentsNumber <= 0) {
      newFieldErrors.students = 'El número de alumnos debe ser mayor a 0.'
    }

    if (studentsNumber > slot.available) {
      newFieldErrors.students =
        'El número de alumnos supera los cupos disponibles para este horario.'
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors)
      setError('Por favor corrige los errores antes de continuar.')
      return
    }

    onConfirm({
      amie: form.amie.trim(),
      schoolName: form.schoolName.trim(),
      coordinatorName: form.coordinatorName.trim(),
      coordinatorLastName: form.coordinatorLastName.trim(),
      whatsapp: form.whatsapp.trim(),
      students: studentsNumber,
    })

    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="modal-header-icon">G</div>
            <div>
              <h2 className="text-base md:text-lg font-semibold">Reserva de horario</h2>
              <p className="text-xs md:text-sm text-white/80">
                Global Money Week · Centro de Exposiciones Quito
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3 border border-[#e0e7ff]">
            <div className="flex items-center gap-3 text-sm text-[#2c3e50]">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1f4b9e] text-white text-xs font-semibold">
                {slot.time.split(' ')[0]}
              </span>
              <div>
                <p className="font-medium">{slot.time}</p>
                <p className="text-xs text-[#6c757d]">
                  Cupos disponibles:{' '}
                  <span className="font-semibold text-[#1f4b9e]">{slot.available}</span>
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2c3e50] mb-1">
                Código AMIE
              </label>
              <input
                type="text"
                value={form.amie}
                onChange={(e) => handleChange('amie', e.target.value)}
                className="w-full rounded-full border border-[#e0e7ff] bg-white/90 px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4c96cc] focus:border-[#4c96cc] placeholder:text-[#c0c6d4]"
              />
              {fieldErrors.amie && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.amie}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c3e50] mb-1">
                Nombre del colegio
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className="w-full rounded-full border border-[#e0e7ff] bg-white/90 px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4c96cc] focus:border-[#4c96cc] placeholder:text-[#c0c6d4]"
              />
              {fieldErrors.schoolName && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.schoolName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c3e50] mb-1">
                Nombre del coordinador
              </label>
              <input
                type="text"
                value={form.coordinatorName}
                onChange={(e) => handleChange('coordinatorName', e.target.value)}
                className="w-full rounded-full border border-[#e0e7ff] bg-white/90 px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4c96cc] focus:border-[#4c96cc] placeholder:text-[#c0c6d4]"
              />
              {fieldErrors.coordinatorName && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.coordinatorName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c3e50] mb-1">
                Apellido del coordinador
              </label>
              <input
                type="text"
                value={form.coordinatorLastName}
                onChange={(e) => handleChange('coordinatorLastName', e.target.value)}
                className="w-full rounded-full border border-[#e0e7ff] bg-white/90 px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4c96cc] focus:border-[#4c96cc] placeholder:text-[#c0c6d4]"
              />
              {fieldErrors.coordinatorLastName && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.coordinatorLastName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c3e50] mb-1">
                Número de WhatsApp
              </label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full rounded-full border border-[#e0e7ff] bg-white/90 px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4c96cc] focus:border-[#4c96cc] placeholder:text-[#c0c6d4]"
              />
              {fieldErrors.whatsapp && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.whatsapp}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c3e50] mb-1">
                Número de alumnos asistentes
              </label>
              <input
                type="number"
                min={1}
                value={form.students}
                onChange={(e) => handleChange('students', e.target.value)}
                className="w-full rounded-full border border-[#e0e7ff] bg-white/90 px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4c96cc] focus:border-[#4c96cc] placeholder:text-[#c0c6d4]"
              />
              {fieldErrors.students && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.students}</p>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-5 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-[#e0e7ff] bg-white px-5 py-2.5 text-sm font-semibold text-[#2c3e50] hover:bg-[#f8f9fa]"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary md:px-7">
              Confirmar reserva
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

