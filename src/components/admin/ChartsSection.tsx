import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import type { EventDay } from '../../data/eventData'
import { calculateDayMetrics, calculateSlotMetrics } from '../../utils/metricsCalculator'

type ChartsSectionProps = {
  days: EventDay[]
}

export function ChartsSection({ days }: ChartsSectionProps) {
  try {
    const dayMetrics = calculateDayMetrics(days)
    const slotMetrics = calculateSlotMetrics(days)

  // Datos para gráfico de distribución por día
  const dayDistributionData = dayMetrics.map((day) => ({
    día: day.day,
    estudiantes: day.totalStudents,
    colegios: day.totalSchools,
  }))

  // Datos para gráfico de ocupación por horario
  const slotOccupancyData = slotMetrics.map((slot) => ({
    horario: `${slot.day.split(' ')[0]} ${slot.time}`,
    ocupados: slot.occupied,
    disponibles: slot.available,
  }))

  // Datos para gráfico de tasa de ocupación por día
  const occupancyRateData = dayMetrics.map((day) => ({
    día: day.day,
    ocupación: day.occupancyRate,
  }))

  // Datos para gráfico de estudiantes por colegio (top 10)
  const allReservations = days.flatMap((day) =>
    day.slots.flatMap((slot) => slot.schools)
  )

  const schoolStudentsMap = new Map<string, number>()
  allReservations.forEach((reservation) => {
    const current = schoolStudentsMap.get(reservation.schoolName) || 0
    schoolStudentsMap.set(reservation.schoolName, current + reservation.students)
  })

  const topSchoolsData = Array.from(schoolStudentsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, students]) => ({
      colegio: name.length > 20 ? name.substring(0, 20) + '...' : name,
      estudiantes: students,
    }))

  return (
    <div className="space-y-8 mb-6">
      <h3 className="text-xl font-bold mb-4" style={{ color: '#2c3e50' }}>
        Gráficos y Análisis
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de estudiantes por día */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{ backgroundColor: '#ffffff', borderColor: '#e9ecef' }}
        >
          <h4 className="text-lg font-bold mb-4" style={{ color: '#2c3e50' }}>
            Distribución de Estudiantes por Día
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dayDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="día" stroke="#6c757d" />
              <YAxis stroke="#6c757d" />
              <Tooltip />
              <Legend />
              <Bar dataKey="estudiantes" fill="#1f4b9e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ocupación por horario */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{ backgroundColor: '#ffffff', borderColor: '#e9ecef' }}
        >
          <h4 className="text-lg font-bold mb-4" style={{ color: '#2c3e50' }}>
            Ocupación por Horario
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={slotOccupancyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis type="number" stroke="#6c757d" />
              <YAxis dataKey="horario" type="category" width={100} stroke="#6c757d" />
              <Tooltip />
              <Legend />
              <Bar dataKey="ocupados" fill="#dc3545" />
              <Bar dataKey="disponibles" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasa de ocupación por día */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{ backgroundColor: '#ffffff', borderColor: '#e9ecef' }}
        >
          <h4 className="text-lg font-bold mb-4" style={{ color: '#2c3e50' }}>
            Tasa de Ocupación por Día
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="día" stroke="#6c757d" />
              <YAxis stroke="#6c757d" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ocupación"
                stroke="#ffd000"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 colegios por estudiantes */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{ backgroundColor: '#ffffff', borderColor: '#e9ecef' }}
        >
          <h4 className="text-lg font-bold mb-4" style={{ color: '#2c3e50' }}>
            Top 10 Colegios por Estudiantes
          </h4>
          {topSchoolsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSchoolsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis type="number" stroke="#6c757d" />
                <YAxis dataKey="colegio" type="category" width={120} stroke="#6c757d" />
                <Tooltip />
                <Legend />
                <Bar dataKey="estudiantes" fill="#4c96cc" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div
              className="flex items-center justify-center h-[300px]"
              style={{ color: '#6c757d' }}
            >
              No hay datos disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('Error rendering charts:', error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
        <p className="text-red-700 font-medium">
          Error al cargar los gráficos. Por favor, recarga la página.
        </p>
      </div>
    )
  }
}
