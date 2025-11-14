import { useQuery } from '@tanstack/react-query';
import DonationService from '@/services/donationService';

export const useDonationsQuery = () => {
  return useQuery({
    queryKey: ['donations'],
    queryFn: DonationService.findAll,
  });
};
