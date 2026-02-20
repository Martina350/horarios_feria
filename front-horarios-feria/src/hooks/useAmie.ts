import { useQuery } from '@tanstack/react-query';
import { amieService } from '../services/amie.service';
import type { AmieResponse } from '../types/api';

/**
 * Hook para consultar un código AMIE
 */
export function useAmie(code: string, enabled: boolean = false) {
  return useQuery<AmieResponse>({
    queryKey: ['amie', code],
    queryFn: () => amieService.getSchoolByAmie(code),
    enabled: enabled && code.length > 0,
    retry: false, // No reintentar si el AMIE no existe
  });
}
