import { useQuery } from '@tanstack/react-query';
import DonorService from '@/services/donorService';

export const useDonorsQuery = () => {
  return useQuery({
    queryKey: ['donors'],
    queryFn: DonorService.findAll,
  });
};
