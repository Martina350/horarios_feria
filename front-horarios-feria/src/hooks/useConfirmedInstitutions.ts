import { useQuery } from '@tanstack/react-query';
import { eventsService } from '../services/events.service';

/**
 * Obtiene instituciones confirmadas para un slot (solo cuando hay slotId).
 */
export function useConfirmedInstitutions(slotId: string | null) {
  return useQuery({
    queryKey: ['events', 'confirmed-institutions', slotId],
    queryFn: () => eventsService.getConfirmedInstitutions(slotId!),
    enabled: !!slotId,
    staleTime: 60_000,
  });
}
