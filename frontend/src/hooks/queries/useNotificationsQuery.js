import { useQuery } from '@tanstack/react-query';
import NotificationService from '@/services/notificationService';

export const NOTIFICATIONS_QUERY_KEY = ['notifications', 'list'];

export const useNotificationsQuery = () => {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: NotificationService.findAll,

    refetchInterval: 60000, // 5 segundos
    staleTime: 0, // sempre deixa atualizar
    refetchOnWindowFocus: true,
  });
};

export const useUnreadCount = () => {
  const { data: notifications = [], ...rest } = useNotificationsQuery();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, unreadCount, ...rest };
};
