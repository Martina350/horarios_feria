import { api } from './api';
import type { EventDayResponse } from '../types/api';

/**
 * Servicio para obtener eventos y días disponibles
 */
export const eventsService = {
  /**
   * Obtiene todos los días con sus horarios disponibles
   */
  async getDays(): Promise<EventDayResponse[]> {
    const response = await api.get<EventDayResponse[]>('/api/events/days');
    return response.data;
  },
};
