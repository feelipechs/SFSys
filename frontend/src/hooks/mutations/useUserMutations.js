import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import UserService from '@/services/userService';
import { getErrorMessage } from '@/utils/errorUtils';

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  // função para invalidar o cache e atualizar a lista na tela
  const onSuccessHandler = (message) => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    toast.success(message, { duration: 3000 });
  };

  // const onErrorHandler = (error, action) => {
  //   // tratamento de erro
  //   console.error(`Erro ao ${action}:`, error);
  //   toast.error(`Falha ao ${action}.`, { description: error.message });
  // };

  const onErrorHandler = (error, action) => {
    // tratamento de erro
    console.error(`Erro ao ${action}:`, error);

    const customErrorMessage = getErrorMessage(error);

    toast.error(`Falha ao ${action}.`, {
      description: customErrorMessage, // usa a mensagem personalizada
    });
  };

  const createMutation = useMutation({
    mutationFn: UserService.create,
    onSuccess: () => onSuccessHandler('Usuário criado com sucesso!'),
    onError: (error) => onErrorHandler(error, 'criar usuário'),
  });

  const updateMutation = useMutation({
    mutationFn: UserService.update,
    onSuccess: () => onSuccessHandler('Usuário atualizado com sucesso!'),
    onError: (error) => onErrorHandler(error, 'atualizar usuário'),
  });

  const deleteMutation = useMutation({
    mutationFn: UserService.delete,
    onSuccess: () => onSuccessHandler('Usuário removido.'),
    onError: (error) => onErrorHandler(error, 'deletar usuário'),
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
