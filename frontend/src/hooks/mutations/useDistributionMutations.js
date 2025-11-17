import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DistributionService from '@/services/distributionService';
import { getErrorMessage } from '@/utils/errorUtils';

export const useDistributionMutations = () => {
  const queryClient = useQueryClient();

  const onSuccessHandler = (message) => {
    queryClient.invalidateQueries({ queryKey: ['distributions'] });
    queryClient.invalidateQueries({ queryKey: ['user', 'stats'] });
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
    mutationFn: DistributionService.create,
    onSuccess: () => onSuccessHandler('Distribuição criada com sucesso!'),
    onError: (error) => onErrorHandler(error, 'criar distribuição'),
  });

  const updateMutation = useMutation({
    mutationFn: DistributionService.update,
    onSuccess: () => onSuccessHandler('Distribuição atualizada com sucesso!'),
    onError: (error) => onErrorHandler(error, 'atualizar distribuição'),
  });

  const deleteMutation = useMutation({
    mutationFn: DistributionService.delete,
    onSuccess: () => onSuccessHandler('Distribuição removida.'),
    onError: (error) => onErrorHandler(error, 'deletar distribuição'),
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
