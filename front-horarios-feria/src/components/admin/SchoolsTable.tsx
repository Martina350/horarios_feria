import { useState, useMemo } from 'react';
import type { ReservationResponse, EventDayResponse } from '../../types/api';
import { reportsService } from '../../services/reports.service';

export type SchoolsTableProps = {
  reservations: ReservationResponse[];
  days?: EventDayResponse[];
  onEdit: (reservation: ReservationResponse) => void;
  onDelete: (reservationId: string) => void;
};

function getDayAndSlotLabels(
  dayId: string,
  slotId: string,
  days?: EventDayResponse[]
): { dayLabel: string; slotTime: string } {
  if (!days?.length) return { dayLabel: dayId, slotTime: slotId };
  const day = days.find((d) => d.id === dayId);
  if (!day) return { dayLabel: dayId, slotTime: slotId };
  const slot = day.slots?.find((s) => s.id === slotId);
  return {
    dayLabel: day.day,
    slotTime: slot?.time ?? slotId,
  };
}

type SortField = 'timestamp' | 'students' | 'schoolName' | 'amie';
type SortDirection = 'asc' | 'desc';

export function SchoolsTable({
  reservations,
  days,
  onEdit,
  onDelete,
}: SchoolsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('students');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar y ordenar reservas
  const filteredAndSorted = useMemo(() => {
    let filtered = reservations.filter((reservation) => {
      const search = searchTerm.toLowerCase();
      return (
        reservation.amie.toLowerCase().includes(search) ||
        reservation.schoolName.toLowerCase().includes(search) ||
        reservation.email.toLowerCase().includes(search) ||
        reservation.dayId.toLowerCase().includes(search) ||
        reservation.slotId.toLowerCase().includes(search)
      );
    });

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'students':
          aValue = a.students;
          bValue = b.students;
          break;
        case 'schoolName':
          aValue = a.schoolName.toLowerCase();
          bValue = b.schoolName.toLowerCase();
          break;
        case 'amie':
          aValue = a.amie.toLowerCase();
          bValue = b.amie.toLowerCase();
          break;
        default:
          aValue = '';
          bValue = '';
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [reservations, searchTerm, sortField, sortDirection]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedReservations = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await reportsService.exportReport('xlsx');
      const filename = `reservas-${new Date().toISOString().split('T')[0]}.xlsx`;
      reportsService.downloadBlob(blob, filename);
    } catch (error) {
      alert('Error al exportar el reporte');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmada: { bg: 'bg-secondary/20', text: 'text-secondary', border: 'border-secondary/30', label: 'Confirmada' },
      pendiente: { bg: 'bg-accent/20', text: 'text-accent-dark', border: 'border-accent/30', label: 'Pendiente' },
      cancelada: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Cancelada' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      label: status,
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <h3 className="text-lg sm:text-xl font-bold font-gothic" style={{ color: '#2c3e50' }}>
          Tabla de Colegios Inscritos
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportExcel}
            className="flex-1 sm:flex-none px-3 py-2 sm:px-4 bg-primary text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-all duration-200 flex items-center justify-center gap-2 shadow-md text-sm"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span className="font-gothic">Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="mb-3 sm:mb-4">
        <input
          type="text"
          placeholder="Buscar por AMIE, colegio, email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-myriad"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-lg border border-slate-200">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-primary/5">
              <th
                className="px-2 py-2 sm:px-4 sm:py-3 text-left cursor-pointer hover:bg-primary/10 transition-colors duration-200 font-gothic text-primary text-xs sm:text-sm"
                onClick={() => handleSort('amie')}
              >
                AMIE
                {sortField === 'amie' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                className="px-2 py-2 sm:px-4 sm:py-3 text-left cursor-pointer hover:bg-primary/10 transition-colors duration-200 font-gothic text-primary text-xs sm:text-sm"
                onClick={() => handleSort('schoolName')}
              >
                Colegio
                {sortField === 'schoolName' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm">Coordinador</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm">Email</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm">WhatsApp</th>
              <th
                className="px-2 py-2 sm:px-4 sm:py-3 text-left cursor-pointer hover:bg-primary/10 transition-colors duration-200 font-gothic text-primary text-xs sm:text-sm"
                onClick={() => handleSort('students')}
              >
                Estudiantes
                {sortField === 'students' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm">Día</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm">Horario</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm">Estado</th>
              <th
                className="px-2 py-2 sm:px-4 sm:py-3 text-left cursor-pointer hover:bg-primary/10 transition-colors duration-200 font-gothic text-primary text-xs sm:text-sm"
                onClick={() => handleSort('timestamp')}
              >
                Fecha
                {sortField === 'timestamp' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                  No se encontraron reservas
                </td>
              </tr>
            ) : (
              paginatedReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="border-b border-slate-100 hover:bg-support/5 transition-colors duration-200"
                >
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-mono text-xs sm:text-sm">{reservation.amie}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm max-w-[120px] sm:max-w-none truncate" title={reservation.schoolName}>{reservation.schoolName}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm max-w-[100px] sm:max-w-none truncate" title={reservation.coordinatorName}>{reservation.coordinatorName}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm max-w-[100px] sm:max-w-[140px] truncate" title={reservation.email}>{reservation.email}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-mono text-xs sm:text-sm">
                    {reservation.whatsapp}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-xs sm:text-sm">
                    {reservation.students}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                    {getDayAndSlotLabels(reservation.dayId, reservation.slotId, days).dayLabel}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                    {getDayAndSlotLabels(reservation.dayId, reservation.slotId, days).slotTime}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">
                    {getStatusBadge(reservation.status)}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                    {new Date(reservation.timestamp).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        onClick={() => onEdit(reservation)}
                        className="p-1 text-primary hover:bg-primary/10 rounded transition-all duration-200"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-lg">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => onDelete(reservation.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1 text-center sm:text-left">
            Mostrando {paginatedReservations.length} de {filteredAndSorted.length}{' '}
            reservas
          </p>
          <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-support/5 transition-all duration-200 font-myriad text-sm"
            >
              Anterior
            </button>
            <span className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-support/5 transition-all duration-200 font-myriad text-sm"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
