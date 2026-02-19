import type { EventDay } from '../../data/eventData'
import { calculateGeneralMetrics } from '../../utils/metricsCalculator'

type MetricsCardsProps = {
  days: EventDay[]
}

export function MetricsCards({ days }: MetricsCardsProps) {
  const metrics = calculateGeneralMetrics(days)

  const cards = [
    {
      title: 'Total de Colegios',
      value: metrics.totalSchools,
      icon: 'school',
      iconBg: '#1f4b9e',
      bgColor: '#f8f9fa',
      textColor: '#2c3e50',
      valueColor: '#1f4b9e',
    },
    {
      title: 'Total de Estudiantes',
      value: metrics.totalStudents.toLocaleString(),
      icon: 'groups',
      iconBg: '#4c96cc',
      bgColor: '#f8f9fa',
      textColor: '#2c3e50',
      valueColor: '#4c96cc',
    },
    {
      title: 'Capacidad Total',
      value: metrics.totalCapacity.toLocaleString(),
      icon: 'event_seat',
      iconBg: '#1f4b9e',
      bgColor: '#f8f9fa',
      textColor: '#2c3e50',
      valueColor: '#1f4b9e',
    },
    {
      title: 'Tasa de Ocupación',
      value: `${metrics.occupancyRate}%`,
      icon: 'trending_up',
      iconBg: '#ffd000',
      bgColor: '#f8f9fa',
      textColor: '#2c3e50',
      valueColor: '#ffd000',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl p-6 shadow-lg border"
          style={{
            backgroundColor: card.bgColor,
            borderColor: '#e9ecef',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="material-symbols-outlined text-3xl" style={{ color: '#6c757d' }}>
              {card.icon}
            </span>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: card.iconBg }}
            >
              <span className="material-symbols-outlined text-white text-xl">
                {card.icon}
              </span>
            </div>
          </div>
          <h3 className="text-sm font-bold mb-1" style={{ color: card.textColor }}>
            {card.title}
          </h3>
          <p className="text-3xl font-black" style={{ color: card.valueColor }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
