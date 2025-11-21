'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationForm from '@/features/Notifications/NotificationForm';
import NotificationsList from '@/features/Notifications/NotificationsList';
import { Bell, Plus } from 'lucide-react';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <main className="bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Centro de Notificações</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as suas notificações em um único lugar
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center md:justify-start">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Criar Nova
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="notifications" className="mt-6">
            <NotificationsList />
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <NotificationForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
