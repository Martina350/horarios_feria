import { useMemo } from 'react'
import type { EventDay } from '../data/eventData'
import {
  calculateGeneralMetrics,
  calculateDayMetrics,
  calculateSlotMetrics,
  getAllReservations,
  calculateAlerts,
} from '../utils/metricsCalculator'

/**
 * Hook para calcular todas las métricas del sistema
 */
export function useMetrics(days: EventDay[]) {
  return useMemo(() => {
    const generalMetrics = calculateGeneralMetrics(days)
    const dayMetrics = calculateDayMetrics(days)
    const slotMetrics = calculateSlotMetrics(days)
    const allReservations = getAllReservations(days)
    const alerts = calculateAlerts(days)

    return {
      generalMetrics,
      dayMetrics,
      slotMetrics,
      allReservations,
      alerts,
    }
  }, [days])
}
