import { useQuery } from '@tanstack/react-query';
import { cepService } from '@/services/cepService';

export function useCepQuery(cep, options = {}) {
  const cleanCEP = cep?.replace(/\D/g, '');

  return useQuery({
    queryKey: ['cep', cleanCEP],
    queryFn: () => cepService.getByCep(cleanCEP),

    // só executa a query se o CEP tiver 8 dígitos
    enabled: cleanCEP?.length === 8 && (options.enabled ?? true),

    // cache por 1 hora
    staleTime: 1000 * 60 * 60, // 1 hora
    cacheTime: 1000 * 60 * 60 * 24, // 24 horas

    // não refetch automático
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    retry: 0,

    ...options,
  });
}
