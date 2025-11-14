import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DonationService from '@/services/donationService';
import { getErrorMessage } from '@/utils/errorUtils';

export const useDonationMutations = () => {
  const queryClient = useQueryClient();

  const onSuccessHandler = (message) => {
    queryClient.invalidateQueries({ queryKey: ['donations'] });
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
    mutationFn: DonationService.create,
    onSuccess: () => onSuccessHandler('Doação criada com sucesso!'),
    onError: (error) => onErrorHandler(error, 'criar doação'),
  });

  const updateMutation = useMutation({
    mutationFn: DonationService.update,
    onSuccess: () => onSuccessHandler('Doação atualizada com sucesso!'),
    onError: (error) => onErrorHandler(error, 'atualizar doação'),
  });

  const deleteMutation = useMutation({
    mutationFn: DonationService.delete,
    onSuccess: () => onSuccessHandler('Doação removida.'),
    onError: (error) => onErrorHandler(error, 'deletar doação'),
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
