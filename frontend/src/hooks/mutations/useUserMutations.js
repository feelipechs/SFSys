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

  // função para invalidar o cache do perfil logado
  const onSuccessProfileHandler = (message) => {
    // invalida a query que o AuthContext/ProfileForm usa para buscar o usuário logado
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    queryClient.invalidateQueries({ queryKey: ['profile'] }); // invalida outras possíveis chaves de perfil
    queryClient.invalidateQueries({ queryKey: ['user', 'stats'] });
    queryClient.invalidateQueries({ queryKey: ['global', 'stats'] });
    toast.success(message, { duration: 3000 });
  };

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

  const updateProfileMutation = useMutation({
    mutationFn: UserService.updateProfile,
    onSuccess: () =>
      onSuccessProfileHandler('Seu perfil foi atualizado com sucesso!'),
    onError: (error) => onErrorHandler(error, 'atualizar seu perfil'),
  });

  const deleteMutation = useMutation({
    mutationFn: UserService.delete,
    onSuccess: () => onSuccessHandler('Usuário removido.'),
    onError: (error) => onErrorHandler(error, 'deletar usuário'),
  });

  return {
    create: createMutation,
    update: updateMutation,
    updateProfile: updateProfileMutation,
    remove: deleteMutation,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      updateProfileMutation.isPending ||
      deleteMutation.isPending,
  };
};
