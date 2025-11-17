import { useQuery } from '@tanstack/react-query';
import UserService from '@/services/userService';

const fetchUserStats = async () => {
  const { data } = await UserService.getStats();
  return data;
};

export const useUserStatsQuery = () => {
  return useQuery({
    queryKey: ['user', 'stats'],
    queryFn: fetchUserStats,
    // configurações de cache e retry
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });
};
