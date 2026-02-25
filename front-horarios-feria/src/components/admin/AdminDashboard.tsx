import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useReservations, useUpdateReservation, useDeleteReservation } from '../../hooks/useReservations';
import { useGeneralMetrics, useDayMetrics } from '../../hooks/useMetrics';
import { MetricsCards } from './MetricsCards';
import { ChartsSection } from './ChartsSection';
import { SchoolsTable } from './SchoolsTable';
import { EditReservationModal } from './EditReservationModal';
import type { ReservationResponse } from '../../types/api';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: reservations, isLoading: reservationsLoading } = useReservations();
  const { data: generalMetrics, isLoading: metricsLoading } = useGeneralMetrics();
  const { data: dayMetrics } = useDayMetrics();
  const updateReservation = useUpdateReservation();
  const deleteReservation = useDeleteReservation();
  const [editingReservation, setEditingReservation] = useState<ReservationResponse | null>(null);

  const handleEdit = (reservation: ReservationResponse) => {
    setEditingReservation(reservation);
  };

  const handleDelete = async (reservationId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      return;
    }

    try {
      await deleteReservation.mutateAsync(reservationId);
    } catch (error) {
      alert('Error al eliminar la reserva');
    }
  };

  const handleSaveEdit = async (updatedReservation: ReservationResponse) => {
    try {
      await updateReservation.mutateAsync({
        id: updatedReservation.id,
        dto: {
          amie: updatedReservation.amie,
          schoolName: updatedReservation.schoolName,
          coordinatorName: updatedReservation.coordinatorName,
          coordinatorLastName: updatedReservation.coordinatorLastName,
          email: updatedReservation.email,
          whatsapp: updatedReservation.whatsapp,
          students: updatedReservation.students,
          dayId: updatedReservation.dayId,
          slotId: updatedReservation.slotId,
          status: updatedReservation.status,
        },
      });
      setEditingReservation(null);
    } catch (error) {
      alert('Error al actualizar la reserva');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (reservationsLoading || metricsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 font-myriad">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Convertir datos del backend al formato esperado por los componentes
  const convertedReservations = reservations || [];
  const convertedMetrics = generalMetrics || {
    totalSchools: 0,
    totalStudents: 0,
    totalCapacity: 0,
    occupancyRate: 0,
    mostRequestedSlots: [],
    leastRequestedSlots: [],
    highestDemandDay: null,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                title="Volver a vista pública"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-childhood uppercase truncate">Panel de Administración</h1>
                <p className="text-xs sm:text-sm text-white/80 font-myriad truncate">Global Money Week - Gestión de Reservas</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button
                onClick={handleLogout}
                className="px-3 py-2 sm:px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="font-myriad hidden sm:inline">Cerrar sesión</span>
              </button>
              <div className="flex items-center gap-2 text-white/90">
                <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                <span className="font-medium font-gothic text-sm sm:text-base">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto px-3 py-5 sm:px-4 sm:py-6 md:py-8">
        {/* Métricas generales */}
        <MetricsCards metrics={convertedMetrics} />

        {/* Gráficos */}
        <div className="mb-6">
          {typeof window !== 'undefined' && dayMetrics && (
            <ChartsSection dayMetrics={dayMetrics} />
          )}
        </div>

        {/* Tabla de colegios */}
        <SchoolsTable
          reservations={convertedReservations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modal de edición */}
        {editingReservation && (
          <EditReservationModal
            reservation={editingReservation}
            onClose={() => setEditingReservation(null)}
            onSave={handleSaveEdit}
          />
        )}
      </main>
    </div>
  );
}
