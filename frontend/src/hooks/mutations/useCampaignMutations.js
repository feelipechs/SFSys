import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CampaignService from '@/services/campaignService';
import { getErrorMessage } from '@/utils/errorUtils';

export const useCampaignMutations = () => {
  const queryClient = useQueryClient();

  const onSuccessHandler = (message) => {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
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
    mutationFn: CampaignService.create,
    onSuccess: () => onSuccessHandler('Campanha criada com sucesso!'),
    onError: (error) => onErrorHandler(error, 'criar campanha'),
  });

  const updateMutation = useMutation({
    mutationFn: CampaignService.update,
    onSuccess: () => onSuccessHandler('Campanha atualizada com sucesso!'),
    onError: (error) => onErrorHandler(error, 'atualizar campanha'),
  });

  const deleteMutation = useMutation({
    mutationFn: CampaignService.delete,
    onSuccess: () => onSuccessHandler('Campanha removida.'),
    onError: (error) => onErrorHandler(error, 'deletar campanha'),
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
