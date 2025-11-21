'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, AlertCircle, Info, Bell, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useNotificationMutations } from '@/hooks/mutations/useNotificationMutations';
import { formatDateTime } from '@/utils/formatters';

export default function NotificationItem({ notification }) {
  const { markAsRead, deleteOne: deleteNotification } =
    useNotificationMutations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formattedDateTime = formatDateTime(notification.created_at);

  const getIcon = (size = 'w-5 h-5') => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className={`${size} text-green-500`} />;
      case 'error':
        return <AlertCircle className={`${size} text-red-500`} />;
      case 'info':
        return <Info className={`${size} text-blue-500`} />;
      default:
        return <Bell className={`${size} text-amber-500`} />;
    }
  };

  const getBackgroundColor = () => {
    if (notification.isRead) return 'bg-muted';
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950';
      case 'error':
        return 'bg-red-50 dark:bg-red-950';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950';
      default:
        return 'bg-amber-50 dark:bg-amber-950';
    }
  };

  const handleOpenDialog = () => {
    // marca como lida apenas se ainda não foi lida
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // previne que o clique feche/abra o dialog ou marque como lida
    deleteNotification.mutate(notification.id);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card
          className={`p-4 transition-all cursor-pointer border-l-4 ${getBackgroundColor()}`}
          onClick={handleOpenDialog} // abre o dialog e marca como lida
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">{getIcon()}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {notification.title}
                  </h3>
                  {notification.sender && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {notification.sender.name || 'Sistema'}{' '}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground line-clamp-2 mt-1 break-all">
                    {notification.message}
                  </div>
                  <time className="text-xs text-muted-foreground mt-2 block">
                    {formattedDateTime}
                  </time>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 flex-shrink-0 hover:bg-destructive/20 hover:text-destructive cursor-pointer"
                  onClick={handleDelete}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {!notification.isRead && (
                <div className="mt-2 h-1 w-1 rounded-full bg-primary"></div>
              )}
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-lg lg:max-w-xl flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon('w-6 h-6')}
            {notification.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {notification.sender && (
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                De: {notification.sender.name || 'Sistema'}
              </span>
            )}
            Em: {formatDateTime(notification.created_at)}
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />
        <div className="flex-1 max-h-[60vh] overflow-y-auto p-1">
          <div className="text-sm break-words whitespace-pre-wrap">
            {notification.message}
          </div>
        </div>
        <Button onClick={handleCloseDialog}>Fechar</Button>
      </DialogContent>
    </Dialog>
  );
}
