import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import NotificationService from '@/services/notificationService';
import { NOTIFICATIONS_QUERY_KEY } from '../queries/useNotificationsQuery';
import { getErrorMessage } from '@/utils/errorUtils';

export const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const onErrorHandler = (error, action) => {
    const msg = getErrorMessage(error);
    toast.error(`Falha ao ${action}.`, { description: msg });
  };

  const markAsRead = useMutation({
    mutationFn: NotificationService.markAsRead,

    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      const previous = queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY);

      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (old) =>
        old?.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );

      return { previous };
    },

    onError: (error, _, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, ctx.previous);
      }
      onErrorHandler(error, 'marcar notificação como lida');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: NotificationService.markAllAsRead,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      const previous = queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY);

      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (old) =>
        old?.map((n) => ({ ...n, isRead: true }))
      );

      return { previous };
    },

    onError: (error, _, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, ctx.previous);
      }
      onErrorHandler(error, 'marcar todas como lidas');
    },

    onSuccess: () => {
      toast.success('Todas as notificações foram marcadas como lidas.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const deleteOne = useMutation({
    mutationFn: NotificationService.delete,

    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      const previous = queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY);

      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (old) =>
        old?.filter((n) => n.id !== notificationId)
      );

      return { previous };
    },

    onError: (error, _, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, ctx.previous);
      }
      onErrorHandler(error, 'deletar notificação');
    },

    onSuccess: () => {
      toast.success('Notificação removida.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const deleteAll = useMutation({
    mutationFn: NotificationService.deleteAll,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      const previous = queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY);

      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, []);

      return { previous };
    },

    onError: (error, _, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, ctx.previous);
      }
      onErrorHandler(error, 'deletar todas as notificações');
    },

    onSuccess: () => {
      toast.success('Todas as notificações foram removidas.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const sendBulk = useMutation({
    mutationFn: NotificationService.sendBulk,

    onSuccess: (data) => {
      toast.success(`${data.affectedCount} notificações enviadas com sucesso!`);
    },

    onError: (error) => onErrorHandler(error, 'enviar notificações em massa'),
  });

  return {
    markAsRead,
    markAllAsRead,
    deleteOne,
    deleteAll,
    sendBulk,
  };
};
