import { useState, useMemo } from 'react'
import type { SchoolReservation, EventDay } from '../../data/eventData'
import { getAllReservations } from '../../utils/metricsCalculator'
import { exportReservationsToExcel } from '../../utils/exportToExcel'

type SchoolsTableProps = {
  days: EventDay[]
  onEdit: (reservation: SchoolReservation) => void
  onDelete: (reservationId: string) => void
}

type SortField = 'timestamp' | 'students' | 'schoolName' | 'amie'
type SortDirection = 'asc' | 'desc'

export function SchoolsTable({ days, onEdit, onDelete }: SchoolsTableProps) {
  const allReservations = getAllReservations(days)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('students')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filtrar y ordenar reservas
  const filteredAndSorted = useMemo(() => {
    let filtered = allReservations.filter((reservation) => {
      const search = searchTerm.toLowerCase()
      return (
        reservation.amie.toLowerCase().includes(search) ||
        reservation.schoolName.toLowerCase().includes(search) ||
        reservation.email.toLowerCase().includes(search) ||
        reservation.dayId.toLowerCase().includes(search) ||
        reservation.slotId.toLowerCase().includes(search)
      )
    })

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime()
          bValue = new Date(b.timestamp).getTime()
          break
        case 'students':
          aValue = a.students
          bValue = b.students
          break
        case 'schoolName':
          aValue = a.schoolName.toLowerCase()
          bValue = b.schoolName.toLowerCase()
          break
        case 'amie':
          aValue = a.amie.toLowerCase()
          bValue = b.amie.toLowerCase()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [allReservations, searchTerm, sortField, sortDirection])

  // Paginación
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage)
  const paginatedReservations = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleExportExcel = () => {
    exportReservationsToExcel(filteredAndSorted)
  }


  return (
    <div
      className="rounded-2xl shadow-lg border p-6"
      style={{ backgroundColor: '#ffffff', borderColor: '#e9ecef' }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold" style={{ color: '#2c3e50' }}>
          Registro de Colegios Inscritos
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
            style={{ backgroundColor: '#4c96cc' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f4b9e')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4c96cc')}
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por AMIE, nombre, email, día o horario..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full px-4 py-3 rounded-xl outline-none transition-all"
          style={{
            border: '1px solid #e9ecef',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#1f4b9e'
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(31, 75, 158, 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e9ecef'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className="border-b"
              style={{ backgroundColor: '#f8f9fa', borderColor: '#e9ecef' }}
            >
              <th
                className="px-4 py-3 text-left text-xs font-bold uppercase cursor-pointer transition-colors"
                style={{ color: '#6c757d' }}
                onClick={() => handleSort('amie')}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
              >
                AMIE
                {sortField === 'amie' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold uppercase cursor-pointer transition-colors"
                style={{ color: '#6c757d' }}
                onClick={() => handleSort('schoolName')}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
              >
                Colegio
                {sortField === 'schoolName' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: '#6c757d' }}>
                Coordinador
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: '#6c757d' }}>
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: '#6c757d' }}>
                WhatsApp
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold uppercase cursor-pointer transition-colors"
                style={{ color: '#6c757d' }}
                onClick={() => handleSort('students')}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
              >
                Estudiantes
                {sortField === 'students' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: '#6c757d' }}>
                Día
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: '#6c757d' }}>
                Horario
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold uppercase cursor-pointer transition-colors"
                style={{ color: '#6c757d' }}
                onClick={() => handleSort('timestamp')}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
              >
                Fecha
                {sortField === 'timestamp' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: '#6c757d' }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center" style={{ color: '#6c757d' }}>
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              paginatedReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="border-b transition-colors"
                  style={{ borderColor: '#e9ecef' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#2c3e50' }}>
                    {reservation.amie}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#2c3e50' }}>
                    {reservation.schoolName}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#2c3e50' }}>
                    {reservation.coordinatorName}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#6c757d' }}>
                    {reservation.email}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#6c757d' }}>
                    +593{reservation.whatsapp}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: '#2c3e50' }}>
                    {reservation.students}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#6c757d' }}>
                    {reservation.dayId}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#6c757d' }}>
                    {reservation.slotId}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#6c757d' }}>
                    {new Date(reservation.timestamp).toLocaleString('es-EC', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(reservation)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: '#1f4b9e' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(reservation.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: '#dc3545' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
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
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm" style={{ color: '#6c757d' }}>
            Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} de{' '}
            {filteredAndSorted.length} registros
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                backgroundColor: '#f8f9fa',
                color: '#2c3e50',
                border: '1px solid #e9ecef',
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#e9ecef'
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa'
                }
              }}
            >
              Anterior
            </button>
            <span
              className="px-4 py-2 text-white rounded-xl font-bold"
              style={{ backgroundColor: '#1f4b9e' }}
            >
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                backgroundColor: '#f8f9fa',
                color: '#2c3e50',
                border: '1px solid #e9ecef',
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#e9ecef'
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa'
                }
              }}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
