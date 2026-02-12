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
            <div className="modal-header-icon">
              <span className="material-symbols-outlined text-2xl">savings</span>
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold leading-none">
                Reserva de horario
              </h2>
              <p className="text-xs md:text-sm text-white/80">
                Global Money Week x Michi Money
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-8 flex flex-wrap items-center gap-4 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-[#1f4b9e] font-bold text-sm">
              <span className="material-symbols-outlined">schedule</span>
              <span>{slot.time}</span>
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="flex items-center gap-2 text-[#1f4b9e] font-bold text-sm">
              <span className="material-symbols-outlined">groups</span>
              <span>Cupos disponibles: {slot.available}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Código AMIE
              </label>
              <input
                type="text"
                value={form.amie}
                onChange={(e) => handleChange('amie', e.target.value)}
                placeholder="Ej: 17H00123"
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4b9e]/10 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              />
              {fieldErrors.amie && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.amie}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Nombre del colegio
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                placeholder="Nombre completo"
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4b9e]/10 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              />
              {fieldErrors.schoolName && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.schoolName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Nombre del coordinador
              </label>
              <input
                type="text"
                value={form.coordinatorName}
                onChange={(e) => handleChange('coordinatorName', e.target.value)}
                placeholder="Tus nombres"
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4b9e]/10 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              />
              {fieldErrors.coordinatorName && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.coordinatorName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Apellido del coordinador
              </label>
              <input
                type="text"
                value={form.coordinatorLastName}
                onChange={(e) => handleChange('coordinatorLastName', e.target.value)}
                placeholder="Tus apellidos"
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4b9e]/10 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              />
              {fieldErrors.coordinatorLastName && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.coordinatorLastName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Número de WhatsApp
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1f4b9e] font-bold border-r border-slate-200 pr-3">
                  +593
                </span>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="99 999 9999"
                  className="w-full pl-20 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4b9e]/10 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
              {fieldErrors.whatsapp && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.whatsapp}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Número de alumnos asistentes
              </label>
              <input
                type="number"
                min={1}
                value={form.students}
                onChange={(e) => handleChange('students', e.target.value)}
                placeholder="Máximo 200"
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4b9e]/10 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              />
              {fieldErrors.students && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.students}</p>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3.5 text-slate-500 hover:text-[#1f4b9e] font-bold rounded-2xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-3.5 bg-[#ffd000] text-[#1f4b9e] font-extrabold rounded-2xl shadow-xl shadow-[#ffd000]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-black/10"
            >
              Confirmar reserva
              <span className="material-symbols-outlined font-bold">rocket_launch</span>
            </button>
          </div>
        </form>
        </div>
        <div className="px-8 py-5 bg-[#1f4b9e]/5 flex items-center gap-3 border-t border-[#1f4b9e]/10">
          <span className="material-symbols-outlined text-[#1f4b9e]">verified_user</span>
          <p className="text-sm text-[#1f4b9e]/80 font-medium">
            Al confirmar, recibirás un comprobante digital en tu correo.
          </p>
        </div>
      </div>
    </div>
  )
}

