import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const fetchGlobalStats = async () => {
  const response = await api.get('/stats/global');
  return response.data;
};

export const useGlobalStatsQuery = () => {
  return useQuery({
    queryKey: ['global', 'stats'],
    queryFn: fetchGlobalStats,
    staleTime: 1000 * 60 * 10, // 10minutos
    // staleTime: 1000 * 10, // 30s
  });
};
