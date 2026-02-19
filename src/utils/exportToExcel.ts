import * as XLSX from 'xlsx'
import type { SchoolReservation } from '../data/eventData'

/**
 * Exporta las reservas a un archivo Excel
 */
export function exportReservationsToExcel(
  reservations: SchoolReservation[],
  filename = 'reservas_feria.xlsx'
) {
  // Preparar datos para Excel
  const data = reservations.map((reservation) => ({
    'Código AMIE': reservation.amie,
    'Nombre del Colegio': reservation.schoolName,
    'Coordinador': reservation.coordinatorName,
    'Email': reservation.email,
    'WhatsApp': `+593${reservation.whatsapp}`,
    'Estudiantes': reservation.students,
    'Día': reservation.dayId,
    'Horario': reservation.slotId,
    'Fecha de Registro': new Date(reservation.timestamp).toLocaleString('es-EC'),
    'Estado': reservation.status,
  }))

  // Crear workbook y worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas')

  // Ajustar ancho de columnas
  const columnWidths = [
    { wch: 12 }, // AMIE
    { wch: 30 }, // Nombre
    { wch: 30 }, // Coordinador
    { wch: 30 }, // Email
    { wch: 15 }, // WhatsApp
    { wch: 12 }, // Estudiantes
    { wch: 15 }, // Día
    { wch: 15 }, // Horario
    { wch: 20 }, // Fecha
    { wch: 12 }, // Estado
  ]
  worksheet['!cols'] = columnWidths

  // Descargar archivo
  XLSX.writeFile(workbook, filename)
}

/**
 * Exporta las reservas a CSV
 */
export function exportReservationsToCSV(
  reservations: SchoolReservation[],
  filename = 'reservas_feria.csv'
) {
  // Encabezados
  const headers = [
    'Código AMIE',
    'Nombre del Colegio',
    'Coordinador',
    'Email',
    'WhatsApp',
    'Estudiantes',
    'Día',
    'Horario',
    'Fecha de Registro',
    'Estado',
  ]

  // Convertir datos a CSV
  const rows = reservations.map((reservation) => [
    reservation.amie,
    reservation.schoolName,
    reservation.coordinatorName,
    reservation.email,
    `+593${reservation.whatsapp}`,
    reservation.students,
    reservation.dayId,
    reservation.slotId,
    new Date(reservation.timestamp).toLocaleString('es-EC'),
    reservation.status,
  ])

  // Crear contenido CSV
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  // Crear blob y descargar
  const blob = new Blob(['\ufeff' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
