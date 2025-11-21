'use client';

import { useUnreadCount } from '@/hooks/queries/useNotificationsQuery';
import { useNotificationMutations } from '@/hooks/mutations/useNotificationMutations';

import NotificationItem from './NotificationItem';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, CheckCheck } from 'lucide-react'; // icones para loading e delete
import { LoadingContent, LoadingFail } from '@/components/LoadingContent';

export default function NotificationsList() {
  // usa a query para buscar notificações, status e contagem
  const { notifications, unreadCount, isLoading, isError } = useUnreadCount();

  // usa a mutation para limpar todas
  const { deleteAll, markAllAsRead } = useNotificationMutations();

  // handler para limpar todas
  const handleClearAll = () => {
    // chama a mutation. O onSuccess dela no hook já limpa o cache e mostra o toast
    deleteAll.mutate();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  // tratamento de erros: va\zio, carregando etc
  if (isLoading) return <LoadingContent>notificações</LoadingContent>;

  if (isError) return <LoadingFail>notificações</LoadingFail>;

  if (notifications.length === 0) {
    return (
      <Card className="bg-background p-12 text-center">
        <p className="text-muted-foreground">Nenhuma notificação no momento</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Notificações ({notifications.length})
          </h2>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* marcar todas como lidas */}
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              // desabilitado se não houver não lidas ou se a mutação estiver em andamento
              disabled={markAllAsRead.isPending || unreadCount === 0}
            >
              {markAllAsRead.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="mr-2 h-4 w-4" />
              )}
              Ler Todas
            </Button>
          )}

          {/* limpar todas */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={deleteAll.isPending || notifications.length === 0}
          >
            {deleteAll.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Limpar Tudo
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          // passa a notificação para o item que usa as mutations
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
