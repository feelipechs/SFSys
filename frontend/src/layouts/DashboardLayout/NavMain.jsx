import * as React from 'react';
import { IconHomeFilled } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// classes de estilo para o estado ativo
const ACTIVE_CLASSES =
  'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear';
const INACTIVE_CLASSES = 'min-w-8 duration-200 ease-linear';

export function NavMain({ items }) {
  const location = useLocation();

  // função para determinar se o link está ativo
  const isLinkActive = (url) => {
    // lógica exata para o Dashboard (url='/')
    if (url === '/') {
      // o link do Dashboard é ativo somente se a URL for exatamente '/'
      return location.pathname === '/';
    }

    // lógica de STARTS_WITH para todas as outras entidades ('/users', '/products', etc.)
    // garante que '/users' ative quando a URL for '/users/details/1'
    return location.pathname.startsWith(url);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Dashboard"
              asChild
              className={isLinkActive('/') ? ACTIVE_CLASSES : INACTIVE_CLASSES}
            >
              <Link to="/">
                <IconHomeFilled />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className={
                  isLinkActive(item.url) ? ACTIVE_CLASSES : INACTIVE_CLASSES
                }
              >
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
