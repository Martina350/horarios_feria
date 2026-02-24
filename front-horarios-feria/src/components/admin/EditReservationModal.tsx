import { useState, useEffect } from 'react';
import { useEvents } from '../../hooks/useEvents';
import type { ReservationResponse } from '../../types/api';

type EditReservationModalProps = {
  reservation: ReservationResponse;
  onClose: () => void;
  onSave: (reservation: ReservationResponse) => Promise<void>;
};

export function EditReservationModal({
  reservation,
  onClose,
  onSave,
}: EditReservationModalProps) {
  const { data: days } = useEvents();
  const [form, setForm] = useState({
    amie: reservation.amie,
    schoolName: reservation.schoolName,
    coordinatorName: reservation.coordinatorName,
    coordinatorLastName: reservation.coordinatorLastName || '',
    email: reservation.email,
    whatsapp: reservation.whatsapp,
    students: reservation.students.toString(),
    dayId: reservation.dayId,
    slotId: reservation.slotId,
    status: reservation.status,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      amie: reservation.amie,
      schoolName: reservation.schoolName,
      coordinatorName: reservation.coordinatorName,
      coordinatorLastName: reservation.coordinatorLastName || '',
      email: reservation.email,
      whatsapp: reservation.whatsapp,
      students: reservation.students.toString(),
      dayId: reservation.dayId,
      slotId: reservation.slotId,
      status: reservation.status,
    });
  }, [reservation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.amie.trim()) newErrors.amie = 'El código AMIE es obligatorio.';
    if (!form.schoolName.trim())
      newErrors.schoolName = 'El nombre del colegio es obligatorio.';
    if (!form.coordinatorName.trim())
      newErrors.coordinatorName = 'El nombre del coordinador es obligatorio.';
    if (!form.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = 'Por favor ingresa un correo electrónico válido.';
      }
    }
    if (!form.whatsapp.trim()) {
      newErrors.whatsapp = 'El número de WhatsApp es obligatorio.';
    } else if (!/^\d{10}$/.test(form.whatsapp)) {
      newErrors.whatsapp = 'El número de WhatsApp debe tener 10 dígitos.';
    }
    const studentsNumber = Number(form.students);
    if (Number.isNaN(studentsNumber) || studentsNumber <= 0) {
      newErrors.students = 'El número de estudiantes debe ser mayor a 0.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const updatedReservation: ReservationResponse = {
        ...reservation,
        amie: form.amie.trim(),
        schoolName: form.schoolName.trim(),
        coordinatorName: form.coordinatorName.trim(),
        coordinatorLastName: form.coordinatorLastName.trim() || undefined,
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
        students: studentsNumber,
        dayId: form.dayId,
        slotId: form.slotId,
        status: form.status as 'pendiente' | 'confirmada' | 'cancelada',
      };
      await onSave(updatedReservation);
    } catch (error) {
      alert('Error al actualizar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const selectedDay = days?.find((d) => d.id === form.dayId);
  const availableSlots = selectedDay?.slots || [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold">Editar Reserva</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Código AMIE</label>
            <input
              type="text"
              value={form.amie}
              onChange={(e) => {
                setForm({ ...form, amie: e.target.value });
                setErrors({ ...errors, amie: '' });
              }}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.amie && <p className="text-red-600 text-sm mt-1">{errors.amie}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre del Colegio</label>
            <input
              type="text"
              value={form.schoolName}
              onChange={(e) => {
                setForm({ ...form, schoolName: e.target.value });
                setErrors({ ...errors, schoolName: '' });
              }}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.schoolName && (
              <p className="text-red-600 text-sm mt-1">{errors.schoolName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Coordinador</label>
            <input
              type="text"
              value={form.coordinatorName}
              onChange={(e) => {
                setForm({ ...form, coordinatorName: e.target.value });
                setErrors({ ...errors, coordinatorName: '' });
              }}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.coordinatorName && (
              <p className="text-red-600 text-sm mt-1">{errors.coordinatorName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setErrors({ ...errors, email: '' });
              }}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp</label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => {
                setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 10) });
                setErrors({ ...errors, whatsapp: '' });
              }}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.whatsapp && (
              <p className="text-red-600 text-sm mt-1">{errors.whatsapp}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estudiantes</label>
            <input
              type="number"
              value={form.students}
              onChange={(e) => {
                setForm({ ...form, students: e.target.value });
                setErrors({ ...errors, students: '' });
              }}
              className="w-full px-3 py-2 border rounded-lg"
              min="1"
            />
            {errors.students && (
              <p className="text-red-600 text-sm mt-1">{errors.students}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Día</label>
            <select
              value={form.dayId}
              onChange={(e) => {
                setForm({ ...form, dayId: e.target.value, slotId: '' });
              }}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {days?.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Horario</label>
            <select
              value={form.slotId}
              onChange={(e) => setForm({ ...form, slotId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              disabled={!form.dayId}
            >
              <option value="">Selecciona un horario</option>
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.time} ({slot.available} disponibles)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as 'pendiente' | 'confirmada' | 'cancelada',
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 font-myriad"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-all duration-200 shadow-md"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
