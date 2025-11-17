import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import BeneficiaryService from '@/services/beneficiaryService';
import { getErrorMessage } from '@/utils/errorUtils';

export const useBeneficiaryMutations = () => {
  const queryClient = useQueryClient();

  const onSuccessHandler = (message) => {
    queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
    queryClient.invalidateQueries({ queryKey: ['global', 'stats'] });
    toast.success(message, { duration: 3000 });
  };

  const onErrorHandler = (error, action) => {
    console.error(`Erro ao ${action}:`, error);

    const customErrorMessage = getErrorMessage(error);

    toast.error(`Falha ao ${action}.`, {
      description: customErrorMessage,
    });
  };

  const createMutation = useMutation({
    mutationFn: BeneficiaryService.create,
    onSuccess: () => onSuccessHandler('Beneficiário criado com sucesso!'),
    onError: (error) => onErrorHandler(error, 'criar deneficiário'),
  });

  const updateMutation = useMutation({
    mutationFn: BeneficiaryService.update,
    onSuccess: () => onSuccessHandler('Beneficiário atualizado com sucesso!'),
    onError: (error) => onErrorHandler(error, 'atualizar deneficiário'),
  });

  const deleteMutation = useMutation({
    mutationFn: BeneficiaryService.delete,
    onSuccess: () => onSuccessHandler('Beneficiário removido.'),
    onError: (error) => onErrorHandler(error, 'deletar deneficiário'),
  });

  return {
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};
