import { api } from './api';
import type { EventDayResponse, ConfirmedInstitutionsResponse } from '../types/api';

/**
 * Servicio para obtener eventos y días disponibles
 */
export const eventsService = {
  /**
   * Obtiene todos los días con sus horarios disponibles
   */
  async getDays(): Promise<EventDayResponse[]> {
    const response = await api.get<EventDayResponse[]>('/events/days');
    return response.data;
  },

  /**
   * Obtiene instituciones confirmadas para un slot (solo nombre y estudiantes, público)
   */
  async getConfirmedInstitutions(slotId: string): Promise<ConfirmedInstitutionsResponse> {
    const response = await api.get<ConfirmedInstitutionsResponse>(
      `/events/slots/${encodeURIComponent(slotId)}/confirmed-institutions`
    );
    return response.data;
  },
};
