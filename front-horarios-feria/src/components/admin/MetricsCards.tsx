import type { GeneralMetrics } from '../../types/api';

type MetricsCardsProps = {
  metrics: GeneralMetrics;
};

export function MetricsCards({ metrics }: MetricsCardsProps) {
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
      title: 'Capacidad Global',
      value: metrics.totalCapacity.toLocaleString(),
      icon: 'event_seat',
      iconBg: '#ffd000',
      bgColor: '#f8f9fa',
      textColor: '#2c3e50',
      valueColor: '#ffd000',
    },
    {
      title: 'Tasa de Ocupación',
      value: `${metrics.occupancyRate.toFixed(2)}%`,
      icon: 'trending_up',
      iconBg: '#1f4b9e',
      bgColor: '#f8f9fa',
      textColor: '#2c3e50',
      valueColor: '#1f4b9e',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          style={{ backgroundColor: card.bgColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: card.textColor }}>
                {card.title}
              </p>
              <p
                className="text-3xl font-bold mt-2"
                style={{ color: card.valueColor }}
              >
                {card.value}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: card.iconBg }}
            >
              <span className="material-symbols-outlined text-white text-2xl">
                {card.icon}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
