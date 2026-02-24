import { api } from './api';
import type {
  ReservationResponse,
  CreateReservationDto,
  UpdateReservationDto,
} from '../types/api';

/**
 * Servicio para gestionar reservas
 */
export const reservationsService = {
  /**
   * Crea una nueva reserva (público)
   */
  async create(dto: CreateReservationDto): Promise<ReservationResponse> {
    const response = await api.post<ReservationResponse>('/reservations', dto);
    return response.data;
  },

  /**
   * Obtiene todas las reservas (admin)
   */
  async findAll(filters?: {
    dayId?: string;
    slotId?: string;
    status?: string;
    amie?: string;
  }): Promise<ReservationResponse[]> {
    const params = new URLSearchParams();
    if (filters?.dayId) params.append('dayId', filters.dayId);
    if (filters?.slotId) params.append('slotId', filters.slotId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.amie) params.append('amie', filters.amie);

    const response = await api.get<ReservationResponse[]>(
      `/reservations?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Obtiene una reserva por ID (admin)
   */
  async findOne(id: string): Promise<ReservationResponse> {
    const response = await api.get<ReservationResponse>(`/reservations/${id}`);
    return response.data;
  },

  /**
   * Actualiza una reserva (admin)
   */
  async update(
    id: string,
    dto: UpdateReservationDto
  ): Promise<ReservationResponse> {
    const response = await api.patch<ReservationResponse>(
      `/reservations/${id}`,
      dto
    );
    return response.data;
  },

  /**
   * Elimina una reserva (admin)
   */
  async remove(id: string): Promise<void> {
    await api.delete(`/reservations/${id}`);
  },
};
