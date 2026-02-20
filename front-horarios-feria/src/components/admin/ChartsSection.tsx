import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { EventDay } from '../../data/eventData'
import { calculateDayMetrics } from '../../utils/metricsCalculator'

type ChartsSectionProps = {
  days: EventDay[]
}

export function ChartsSection({ days }: ChartsSectionProps) {
  try {
    const dayMetrics = calculateDayMetrics(days)

    // Capacidad por día: 200 estudiantes * 3 horarios = 600 estudiantes por día
    const capacityPerDay = 600

    // Datos combinados: porcentaje de estudiantes y número de colegios
    const combinedData = dayMetrics.map((day) => {
      const percentageStudents = capacityPerDay > 0 
        ? (day.totalStudents / capacityPerDay) * 100 
        : 0

      return {
        día: day.day,
        porcentajeEstudiantes: Math.round(percentageStudents * 100) / 100, // Redondear a 2 decimales
        colegios: day.totalSchools,
        estudiantes: day.totalStudents, // Mantener para el tooltip
      }
    })

  return (
    <div className="space-y-8 mb-6">
      <h3 className="text-xl font-bold mb-4" style={{ color: '#2c3e50' }}>
        Gráficos y Análisis
      </h3>

      <div className="grid grid-cols-1 gap-6">
        {/* Gráfico combinado: Porcentaje de estudiantes (barras) y Número de colegios (línea) */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{ backgroundColor: '#ffffff', borderColor: '#e9ecef' }}
        >
          <h4 className="text-lg font-bold mb-4" style={{ color: '#2c3e50' }}>
            Estudiantes y Colegios Inscritos por Día
          </h4>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="día" stroke="#6c757d" />
              <YAxis
                yAxisId="left"
                label={{ 
                  value: 'Porcentaje de Estudiantes (%)', 
                  angle: -90, 
                  position: 'left',
                  offset: -10,
                  style: { 
                    color: '#6c757d',
                    textAnchor: 'middle'
                  } 
                }}
                stroke="#6c757d"
                domain={[0, 100]}
                width={80}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ 
                  value: 'Número de Colegios', 
                  angle: 90, 
                  position: 'right',
                  offset: -10,
                  style: { 
                    color: '#6c757d',
                    textAnchor: 'middle'
                  } 
                }}
                stroke="#6c757d"
                allowDecimals={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                }}
                formatter={(value: any, name: string | undefined) => {
                  if (!name) return [value, '']
                  if (name === 'Porcentaje de Estudiantes' && typeof value === 'number') {
                    return [`${value.toFixed(2)}%`, name]
                  }
                  return [value, name]
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="porcentajeEstudiantes"
                fill="#1f4b9e"
                name="Porcentaje de Estudiantes"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="colegios"
                stroke="#4c96cc"
                strokeWidth={3}
                name="Colegios Inscritos"
                dot={{ fill: '#4c96cc', r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
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
