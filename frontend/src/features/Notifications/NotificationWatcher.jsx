import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { NOTIFICATIONS_QUERY_KEY } from '@/hooks/queries/useNotificationsQuery';

// SALVA APENAS NOTIFICAÇÕES NÃO LIDAS QUE JÁ CHEGARAM

export const NotificationWatcher = () => {
  const queryClient = useQueryClient();

  // guarda apenas os id's das NÃO LIDAS que já apareceram
  const knownUnreadIds = useRef(new Set());

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event?.type === 'updated' &&
        event?.query?.queryKey.toString() === NOTIFICATIONS_QUERY_KEY.toString()
      ) {
        const list = event.query.state.data;
        if (!list) return;

        // filtra somente as NÃO LIDAS
        const unread = list.filter((n) => !n.isRead);
        const incomingUnreadIds = unread.map((n) => n.id);

        // detecta novas NÃO LIDAS
        const newOnes = incomingUnreadIds.filter(
          (id) => !knownUnreadIds.current.has(id)
        );

        if (newOnes.length > 0) {
          toast.info(`${newOnes.length} nova(s) notificação(ões)!`);
        }

        // adiciona no histórico APENAS as novas NÃO LIDAS
        newOnes.forEach((id) => knownUnreadIds.current.add(id));

        // se uma notificação foi lida, remove do Set para não bloquear futuras
        knownUnreadIds.current.forEach((id) => {
          if (!incomingUnreadIds.includes(id)) {
            knownUnreadIds.current.delete(id);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};
