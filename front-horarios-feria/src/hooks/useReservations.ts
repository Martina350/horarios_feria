import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsService } from '../services/reservations.service';
import type {
  ReservationResponse,
  CreateReservationDto,
  UpdateReservationDto,
} from '../types/api';

/**
 * Hook para obtener todas las reservas (admin)
 */
export function useReservations(filters?: {
  dayId?: string;
  slotId?: string;
  status?: string;
  amie?: string;
}) {
  return useQuery<ReservationResponse[]>({
    queryKey: ['reservations', filters],
    queryFn: () => reservationsService.findAll(filters),
    enabled: !!localStorage.getItem('auth_token'), // Solo si está autenticado
  });
}

/**
 * Hook para crear una reserva (público)
 */
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation<ReservationResponse, Error, CreateReservationDto>({
    mutationFn: (dto) => reservationsService.create(dto),
    onSuccess: () => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['events', 'days'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

/**
 * Hook para actualizar una reserva (admin)
 */
export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation<
    ReservationResponse,
    Error,
    { id: string; dto: UpdateReservationDto }
  >({
    mutationFn: ({ id, dto }) => reservationsService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'days'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

/**
 * Hook para eliminar una reserva (admin)
 */
export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => reservationsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'days'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}
