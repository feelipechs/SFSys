import { AppSidebar } from '@/layouts/DashboardLayout/AppSidebar';
import { SiteHeader } from '@/layouts/DashboardLayout/SiteHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import { NotificationWatcher } from '@/features/Notifications/NotificationWatcher';
import { useNotificationsQuery } from '@/hooks/queries/useNotificationsQuery';

const DashboardLayout = () => {
  useNotificationsQuery();
  return (
    <SidebarProvider
      style={{
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <NotificationWatcher />
        <div className="flex flex-1 flex-col">
          {/* ponto de injeção do conteúdo dinâmico */}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
