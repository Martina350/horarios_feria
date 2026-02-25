import type { TimeSlot } from '../data/eventData'
import { useEffect, useState } from 'react'

type CreateReservationData = {
  amie: string
  schoolName: string
  coordinatorName: string
  email: string
  whatsapp: string
  students: number
}

type ReservationModalProps = {
  isOpen: boolean
  slot: TimeSlot | null
  dayId: string | null
  onClose: () => void
  onConfirm: (values: CreateReservationData) => Promise<void>
}

type FormState = {
  amie: string
  schoolName: string
  coordinatorName: string
  email: string
  whatsapp: string
  students: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = {
  amie: '',
  schoolName: '',
  coordinatorName: '',
  email: '',
  whatsapp: '',
  students: '',
}

const LIMITS = {
  email: 255,
  schoolName: 200,
  coordinatorName: 100,
  studentsMax: 200,
} as const

export function ReservationModal({ isOpen, slot, dayId, onClose, onConfirm }: ReservationModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm)
      setError(null)
      setFieldErrors({})
      setShowSuccess(false)
      setShowToast(false)
    }
  }, [isOpen])

  // Toast de "revisa tu correo" se oculta solo después de 5 s
  useEffect(() => {
    if (!showToast) return
    const t = setTimeout(() => setShowToast(false), 5000)
    return () => clearTimeout(t)
  }, [showToast])

  if (!isOpen || !slot || !dayId) return null

  const handleChange = (field: keyof FormState, rawValue: string) => {
    let value = rawValue

    // No permitir espacios en todos los campos excepto nombre del colegio, nombres y apellidos del coordinador, y número de alumnos
    if (field !== 'schoolName' && field !== 'students' && field !== 'coordinatorName') {
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

    if (field === 'coordinatorName') {
      value = value.slice(0, LIMITS.coordinatorName)
    }

    if (field === 'schoolName') {
      value = value.slice(0, LIMITS.schoolName)
    }

    if (field === 'email') {
      value = value.toLowerCase().slice(0, LIMITS.email)
    }

    if (field === 'students') {
      value = value.replace(/\D/g, '')
      if (value !== '') {
        const num = parseInt(value, 10)
        if (num > LIMITS.studentsMax) value = String(LIMITS.studentsMax)
        else value = value.slice(0, 3) // máx 3 dígitos (200)
      }
    }

    // Limpiar error específico del campo al modificarlo
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
    if (!form.coordinatorName.trim()) newFieldErrors.coordinatorName = 'Los nombres y apellidos del coordinador son obligatorios.'
    if (form.coordinatorName && form.coordinatorName.length > LIMITS.coordinatorName) {
      newFieldErrors.coordinatorName = `Los nombres y apellidos no pueden superar ${LIMITS.coordinatorName} caracteres.`
    }
    if (form.schoolName && form.schoolName.length > LIMITS.schoolName) {
      newFieldErrors.schoolName = `El nombre del colegio no puede superar ${LIMITS.schoolName} caracteres.`
    }

    const emailTrimmed = form.email.trim()
    if (!emailTrimmed) {
      newFieldErrors.email = 'El correo electrónico es obligatorio.'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailTrimmed)) {
        newFieldErrors.email = 'Por favor ingresa un correo electrónico válido.'
      }
      if (emailTrimmed.length > LIMITS.email) {
        newFieldErrors.email = `El correo electrónico no puede superar ${LIMITS.email} caracteres.`
      }
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

    if (studentsNumber > LIMITS.studentsMax) {
      newFieldErrors.students = `El número de alumnos no puede superar ${LIMITS.studentsMax}.`
    } else if (studentsNumber > slot.available) {
      newFieldErrors.students =
        'El número de alumnos supera los cupos disponibles para este horario.'
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors)
      setError('Por favor corrige los errores antes de continuar.')
      return
    }

    if (!slot || !dayId) return

    // onConfirm ahora es async y maneja la llamada al API
    // Pasar los datos directamente sin crear el objeto completo
    const reservationData = {
      amie: form.amie.trim(),
      schoolName: form.schoolName.trim(),
      coordinatorName: form.coordinatorName.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      students: studentsNumber,
    }

    try {
      await onConfirm(reservationData)
      setShowSuccess(true)
      setShowToast(true)
      // Cerrar automáticamente después de 4 segundos para que lean el mensaje
      setTimeout(() => {
        onClose()
      }, 4000)
    } catch (error: any) {
      // Manejar errores del API
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear la reserva'
      setError(errorMessage)
      
      // Si es un error de validación específico, intentar mostrarlo en el campo correspondiente
      if (error?.response?.data?.message?.includes('AMIE')) {
        setFieldErrors({ amie: error.response.data.message })
      } else if (error?.response?.data?.message?.includes('cupos')) {
        setFieldErrors({ students: error.response.data.message })
      }
    }
  }

  return (
    <div className="modal-backdrop">
      {showToast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl bg-secondary text-white text-sm font-medium font-myriad animate-[fadeInUp_0.3s_ease-out]"
          role="status"
          aria-live="polite"
        >
          <span className="material-symbols-outlined text-white">mail</span>
          <span>Revisa tu correo para confirmar tu asistencia.</span>
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="modal-header-icon">
              <span className="material-symbols-outlined text-2xl">savings</span>
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold leading-none text-sm uppercase tracking-widest font-childhood">
                Reserva de horario
              </h2>
              <p className="text-xs md:text-sm text-white/80 font-myriad">
                Global Money Week
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
          {showSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-secondary">mark_email_read</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 font-gothic mb-2">¡Reserva realizada!</h3>
              <p className="text-slate-600 font-myriad max-w-md mx-auto">
                Por favor revisa tu correo electrónico para confirmar los detalles de tu reserva.
              </p>
              <p className="text-sm text-slate-500 font-myriad mt-2">
                Este mensaje se cerrará en unos segundos.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-primary text-white font-gothic rounded-xl hover:opacity-90 transition-opacity"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <>
          <div className="mb-8 flex flex-wrap items-center gap-4 bg-support/5 px-4 py-3 rounded-2xl border border-support/20">
            <div className="flex items-center gap-2 text-support font-bold text-sm font-gothic">
              <span className="material-symbols-outlined">schedule</span>
              <span>{slot.time}</span>
            </div>
            <div className="w-1 h-1 bg-support/30 rounded-full" />
            <div className="flex items-center gap-2 text-support font-bold text-sm font-gothic">
              <span className="material-symbols-outlined">groups</span>
              <span>Cupos disponibles: {slot.available}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 font-gothic">
                Código AMIE
              </label>
              <input
                type="text"
                value={form.amie}
                onChange={(e) => handleChange('amie', e.target.value)}
                placeholder="Ej: 17H00123"
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-400 font-medium font-myriad"
              />
              {fieldErrors.amie && (
                <p className="mt-1 text-xs text-red-600 font-myriad">{fieldErrors.amie}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 font-gothic">
                Nombre del colegio
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                placeholder="Nombre completo"
                maxLength={LIMITS.schoolName}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-400 font-medium font-myriad"
              />
              <p className="mt-1 text-xs text-slate-400 font-myriad">
                {form.schoolName.length}/{LIMITS.schoolName}
              </p>
              {fieldErrors.schoolName && (
                <p className="mt-1 text-xs text-red-600 font-myriad">{fieldErrors.schoolName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 font-gothic">
                Nombres y apellidos del coordinador
              </label>
              <input
                type="text"
                value={form.coordinatorName}
                onChange={(e) => handleChange('coordinatorName', e.target.value)}
                placeholder="Nombres y apellidos completos"
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-400 font-medium font-myriad"
              />
              {fieldErrors.coordinatorName && (
                <p className="mt-1 text-xs text-red-600 font-myriad">{fieldErrors.coordinatorName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 font-gothic">
                Correo electrónico
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="correo@ejemplo.com"
                maxLength={LIMITS.email}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-400 font-medium font-myriad"
              />
              <p className="mt-1 text-xs text-slate-400 font-myriad">
                {form.email.length}/{LIMITS.email}
              </p>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600 font-myriad">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 font-gothic">
                Número de WhatsApp
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold border-r border-slate-200 pr-3 font-gothic">
                  +593
                </span>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="99 999 9999"
                  className="w-full pl-20 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4b9e]/10 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium font-myriad"
                />
              </div>
              {fieldErrors.whatsapp && (
                <p className="mt-1 text-xs text-red-600 font-myriad">{fieldErrors.whatsapp}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 font-gothic">
                Número de alumnos asistentes
              </label>
              <input
                type="number"
                min={1}
                max={LIMITS.studentsMax}
                value={form.students}
                onChange={(e) => handleChange('students', e.target.value)}
                placeholder={`Máximo ${LIMITS.studentsMax}`}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-400 font-medium font-myriad"
              />
              {fieldErrors.students && (
                <p className="mt-1 text-xs text-red-600 font-myriad">{fieldErrors.students}</p>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-myriad">{error}</p>}

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3.5 text-slate-500 hover:text-primary font-bold rounded-2xl transition-all duration-200 font-myriad"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-3.5 bg-primary text-white font-extrabold rounded-2xl shadow-xl shadow-primary/30 hover:bg-[var(--color-primary-hover)] hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 text-sm uppercase font-childhood"
            >
              Reservar ahora
              <span className="material-symbols-outlined font-bold">rocket_launch</span>
            </button>
          </div>
        </form>
            </>
          )}
        </div>
        <div className="px-8 py-5 bg-support/5 flex items-center gap-3 border-t border-support/20">
          <span className="material-symbols-outlined text-support">verified_user</span>
          <p className="text-sm text-support/80 font-medium font-myriad">
            Revisa tu correo para confirmar la reserva.
          </p>
        </div>
      </div>
    </div>
  )
}

