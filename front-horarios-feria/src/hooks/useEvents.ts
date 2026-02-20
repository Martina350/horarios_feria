import { useQuery } from '@tanstack/react-query';
import { eventsService } from '../services/events.service';
import type { EventDayResponse } from '../types/api';

/**
 * Hook para obtener eventos y días disponibles
 */
export function useEvents() {
  return useQuery<EventDayResponse[]>({
    queryKey: ['events', 'days'],
    queryFn: () => eventsService.getDays(),
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: true,
  });
}
