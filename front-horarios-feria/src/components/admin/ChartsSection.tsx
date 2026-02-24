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
} from 'recharts';
import type { DayMetrics } from '../../types/api';

type ChartsSectionProps = {
  dayMetrics: DayMetrics[];
};

export function ChartsSection({ dayMetrics }: ChartsSectionProps) {
  try {
    // Capacidad por día: 200 estudiantes * 3 horarios = 600 estudiantes por día
    const capacityPerDay = 600;

    // Datos combinados: porcentaje de estudiantes y número de colegios
    const combinedData = dayMetrics.map((day) => {
      const percentageStudents =
        capacityPerDay > 0 ? (day.totalStudents / capacityPerDay) * 100 : 0;

      return {
        día: day.day,
        porcentajeEstudiantes: Math.round(percentageStudents * 100) / 100,
        colegios: day.totalSchools,
        estudiantes: day.totalStudents,
      };
    });

    return (
      <div className="space-y-8 mb-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: '#2c3e50' }}>
          Gráficos y Análisis
        </h3>

        <div className="grid grid-cols-1 gap-6">
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
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#6c757d' },
                  }}
                  domain={[0, 100]}
                  stroke="#004DB1"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: 'Número de Colegios',
                    angle: 90,
                    position: 'insideRight',
                    style: { textAnchor: 'middle', fill: '#6c757d' },
                  }}
                  stroke="#A72974"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'porcentajeEstudiantes') {
                      return [`${value}%`, 'Porcentaje de Estudiantes'];
                    }
                    if (name === 'colegios') {
                      return [value, 'Número de Colegios'];
                    }
                    if (name === 'estudiantes') {
                      return [value, 'Total Estudiantes'];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="porcentajeEstudiantes"
                  fill="#004DB1"
                  name="Porcentaje de Estudiantes (%)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="colegios"
                  stroke="#A72974"
                  strokeWidth={3}
                  name="Número de Colegios"
                  dot={{ fill: '#A72974', r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering charts:', error);
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error al cargar los gráficos</p>
      </div>
    );
  }
}
