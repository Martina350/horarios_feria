import type { EventDay } from '../../data/eventData'
import { calculateAlerts } from '../../utils/metricsCalculator'

type AlertsPanelProps = {
  days: EventDay[]
}

export function AlertsPanel({ days }: AlertsPanelProps) {
  const alerts = calculateAlerts(days)

  if (alerts.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 mb-6 border"
        style={{ backgroundColor: '#f8f9fa', borderColor: '#e9ecef' }}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl" style={{ color: '#4c96cc' }}>
            check_circle
          </span>
          <p className="font-medium" style={{ color: '#2c3e50' }}>
            No hay alertas. Todos los horarios están en estado normal.
          </p>
        </div>
      </div>
    )
  }

  const errorAlerts = alerts.filter((a) => a.severity === 'error')
  const warningAlerts = alerts.filter((a) => a.severity === 'warning')
  const infoAlerts = alerts.filter((a) => a.severity === 'info')

  return (
    <div className="mb-6 space-y-4">
      <h3 className="text-xl font-bold mb-4" style={{ color: '#2c3e50' }}>
        Alertas del Sistema
      </h3>

      {errorAlerts.length > 0 && (
        <div className="space-y-2">
          {errorAlerts.map((alert, index) => (
            <div
              key={`error-${index}`}
              className="rounded-lg p-4 flex items-start gap-3 border-l-4"
              style={{
                backgroundColor: '#f8f9fa',
                borderLeftColor: '#dc3545',
              }}
            >
              <span className="material-symbols-outlined" style={{ color: '#dc3545' }}>
                error
              </span>
              <p className="font-medium flex-1" style={{ color: '#2c3e50' }}>
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {warningAlerts.length > 0 && (
        <div className="space-y-2">
          {warningAlerts.map((alert, index) => (
            <div
              key={`warning-${index}`}
              className="rounded-lg p-4 flex items-start gap-3 border-l-4"
              style={{
                backgroundColor: '#f8f9fa',
                borderLeftColor: '#ffd000',
              }}
            >
              <span className="material-symbols-outlined" style={{ color: '#ffd000' }}>
                warning
              </span>
              <p className="font-medium flex-1" style={{ color: '#2c3e50' }}>
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {infoAlerts.length > 0 && (
        <div className="space-y-2">
          {infoAlerts.map((alert, index) => (
            <div
              key={`info-${index}`}
              className="rounded-lg p-4 flex items-start gap-3 border-l-4"
              style={{
                backgroundColor: '#f8f9fa',
                borderLeftColor: '#16a34a',
              }}
            >
              <span className="material-symbols-outlined" style={{ color: '#16a34a' }}>
                info
              </span>
              <p className="font-medium flex-1" style={{ color: '#2c3e50' }}>
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
