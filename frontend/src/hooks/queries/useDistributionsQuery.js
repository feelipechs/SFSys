import { useQuery } from '@tanstack/react-query';
import DistributionService from '@/services/distributionService';

export const useDistributionsQuery = () => {
  return useQuery({
    queryKey: ['distributions'],
    queryFn: DistributionService.findAll,
  });
};
