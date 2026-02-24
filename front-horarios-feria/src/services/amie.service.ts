import { api } from './api';
import type { AmieResponse } from '../types/api';

/**
 * Servicio para consultar códigos AMIE
 */
export const amieService = {
  /**
   * Consulta un código AMIE y retorna el nombre del colegio
   */
  async getSchoolByAmie(code: string): Promise<AmieResponse> {
    const response = await api.get<AmieResponse>(`/amie/${code}`);
    return response.data;
  },
};
