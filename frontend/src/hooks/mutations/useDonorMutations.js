import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DonorService from '@/services/donorService';
import { getErrorMessage } from '@/utils/errorUtils';

export const useDonorMutations = () => {
  const queryClient = useQueryClient();

  const onSuccessHandler = (message) => {
    queryClient.invalidateQueries({ queryKey: ['donors'] });
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
    mutationFn: DonorService.create,
    onSuccess: () => onSuccessHandler('Doador criado com sucesso!'),
    onError: (error) => onErrorHandler(error, 'criar doador'),
  });

  const updateMutation = useMutation({
    mutationFn: DonorService.update,
    onSuccess: () => onSuccessHandler('Doador atualizado com sucesso!'),
    onError: (error) => onErrorHandler(error, 'atualizar doador'),
  });

  const deleteMutation = useMutation({
    mutationFn: DonorService.delete,
    onSuccess: () => onSuccessHandler('Doador removido.'),
    onError: (error) => onErrorHandler(error, 'deletar doador'),
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
