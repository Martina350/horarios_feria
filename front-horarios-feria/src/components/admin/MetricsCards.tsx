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
      iconBg: 'primary',
      bgColor: 'white',
      textColor: '#2c3e50',
      valueColor: 'primary',
    },
    {
      title: 'Total de Estudiantes',
      value: metrics.totalStudents.toLocaleString(),
      icon: 'groups',
      iconBg: 'support',
      bgColor: 'white',
      textColor: '#2c3e50',
      valueColor: 'support',
    },
    {
      title: 'Capacidad Global',
      value: metrics.totalCapacity.toLocaleString(),
      icon: 'event_seat',
      iconBg: 'secondary',
      bgColor: 'white',
      textColor: '#2c3e50',
      valueColor: 'secondary',
    },
    {
      title: 'Tasa de Ocupación',
      value: `${metrics.occupancyRate.toFixed(2)}%`,
      icon: 'trending_up',
      iconBg: 'accent',
      bgColor: 'white',
      textColor: '#2c3e50',
      valueColor: 'accent-dark',
    },
  ];

  const getIconBgClass = (iconBg: string) => {
    switch (iconBg) {
      case 'primary': return 'bg-primary';
      case 'support': return 'bg-support';
      case 'secondary': return 'bg-secondary';
      case 'accent': return 'bg-accent';
      default: return 'bg-primary';
    }
  };

  const getValueColorClass = (valueColor: string) => {
    switch (valueColor) {
      case 'primary': return 'text-primary';
      case 'support': return 'text-support';
      case 'secondary': return 'text-secondary';
      case 'accent-dark': return 'text-accent-dark';
      default: return 'text-primary';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 font-myriad">
                {card.title}
              </p>
              <p className={`text-3xl font-bold mt-2 font-gothic ${getValueColorClass(card.valueColor)}`}>
                {card.value}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${getIconBgClass(card.iconBg)}`}>
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
