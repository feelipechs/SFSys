import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const fetchActivityTrend = async (days = 90) => {
  const response = await api.get(`/stats/activity-trend?days=${days}`);

  return response.data;
};

// hook usado nos componentes
export const useActivityTrendQuery = (days = 90) => {
  return useQuery({
    // a chave inclui 'days' para garantir que o cache mude quando o filtro mudar
    queryKey: ['activity', 'trend', { days }],

    // passa a função de fetch, que agora usa o parâmetro 'days'
    queryFn: () => fetchActivityTrend(days),

    // opcional: Dados de tendência podem ter um cache mais curto, se a precisão for crítica
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });
};
