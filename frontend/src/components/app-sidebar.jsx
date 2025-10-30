import * as React from 'react';
import {
  IconBrandPaypal,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconHome,
  IconListDetails,
  IconPhone,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Link } from 'react-router-dom';
import { ModeToggle } from '@/components/ModeToggle';

const data = {
  user: {
    name: 'Usuário',
    email: 'email@exemplo.com',
    avatar: 'https://github.com/shadcn.png',
  },
  navMain: [
    {
      title: 'Doações Monetárias',
      url: '/doacoes-monetarias',
      icon: IconBrandPaypal,
    },
    {
      title: 'Ajuda',
      url: '/ajuda',
      icon: IconHelp,
    },
    {
      title: 'Contato',
      url: '/contato',
      icon: IconPhone,
    },
  ],
  // navClouds: [],
  navSecondary: [
    {
      title: 'Configurações',
      url: '/configuracoes/perfil',
      icon: IconSettings,
    },
  ],
  // documents: [], necessário popular para mais itens
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconHome className="!size-5" />
                <span className="text-base font-semibold">Início</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <span className="ml-5">
          Tema: <ModeToggle />
        </span>

        {/* caso queira mais uma seção na navbar */}
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
