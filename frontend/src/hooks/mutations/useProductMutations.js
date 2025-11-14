import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProductService from '@/services/productService';
import { getErrorMessage } from '@/utils/errorUtils';

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const onSuccessHandler = (message) => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
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
    mutationFn: ProductService.create,
    onSuccess: () => onSuccessHandler('Produto criado com sucesso!'),
    onError: (error) => onErrorHandler(error, 'criar produto'),
  });

  const updateMutation = useMutation({
    mutationFn: ProductService.update,
    onSuccess: () => onSuccessHandler('Produto atualizado com sucesso!'),
    onError: (error) => onErrorHandler(error, 'atualizar produto'),
  });

  const deleteMutation = useMutation({
    mutationFn: ProductService.delete,
    onSuccess: () => onSuccessHandler('Produto removido.'),
    onError: (error) => onErrorHandler(error, 'deletar produto'),
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
