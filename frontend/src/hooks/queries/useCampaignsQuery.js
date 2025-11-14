import { useQuery } from '@tanstack/react-query';
import CampaignService from '@/services/campaignService';

export const useCampaignsQuery = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: CampaignService.findAll,
  });
};
