import { api } from './api';
import type { GeneralMetrics, DayMetrics, SlotMetrics } from '../types/api';

/**
 * Servicio para obtener métricas (admin)
 */
export const metricsService = {
  /**
   * Obtiene métricas generales
   */
  async getGeneralMetrics(): Promise<GeneralMetrics> {
    const response = await api.get<GeneralMetrics>('/api/metrics');
    return response.data;
  },

  /**
   * Obtiene métricas por día
   */
  async getDayMetrics(): Promise<DayMetrics[]> {
    const response = await api.get<DayMetrics[]>('/api/metrics/days');
    return response.data;
  },

  /**
   * Obtiene métricas por horario
   */
  async getSlotMetrics(): Promise<SlotMetrics[]> {
    const response = await api.get<SlotMetrics[]>('/api/metrics/slots');
    return response.data;
  },
};
