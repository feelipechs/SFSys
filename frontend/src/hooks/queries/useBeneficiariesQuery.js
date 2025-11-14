import { useQuery } from '@tanstack/react-query';
import BeneficiaryService from '@/services/beneficiaryService';

export const useBeneficiariesQuery = () => {
  return useQuery({
    queryKey: ['beneficiaries'],
    queryFn: BeneficiaryService.findAll,
  });
};
