'use client';

import * as React from 'react';
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react';

import { BiSolidReport } from 'react-icons/bi';
import { GiCannedFish } from 'react-icons/gi';
import { GoPackageDependents } from 'react-icons/go';
import { MdFamilyRestroom } from 'react-icons/md';
import {
  FaHandsHelping,
  FaHandHoldingHeart,
  FaPeopleCarry,
  FaUser,
  FaPaperPlane,
  FaQuestion,
} from 'react-icons/fa';

import { NavMain } from '@/layouts/DashboardLayout/NavMain';
import { NavSecondary } from './NavSecondary';
import { NavTertiary } from './NavTertiary';
import { NavUser } from '@/layouts/DashboardLayout/NavUser';
import { TeamSwitcher } from '@/layouts/DashboardLayout/TeamSwitcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://github.com/shadcn.png',
  },
  teams: [
    {
      name: 'Time Um',
      logo: GalleryVerticalEnd,
      plan: 'Avançado',
    },
    {
      name: 'Time Dois',
      logo: AudioWaveform,
      plan: 'Intermediário',
    },
    {
      name: 'Time Três',
      logo: Command,
      plan: 'Iniciante',
    },
  ],
  navMain: [
    {
      title: 'Beneficiários',
      url: '/beneficiaries',
      icon: MdFamilyRestroom,
    },
    {
      title: 'Campanhas',
      url: '/campaigns',
      icon: FaHandsHelping,
    },
    {
      title: 'Distribuições',
      url: '/distributions',
      icon: GoPackageDependents,
    },
    {
      title: 'Doações',
      url: '/donations',
      icon: FaHandHoldingHeart,
    },
    {
      title: 'Doadores',
      url: '/donors',
      icon: FaPeopleCarry,
    },
    {
      title: 'Produtos',
      url: '/products',
      icon: GiCannedFish,
    },
    {
      title: 'Usuários',
      url: '/users',
      icon: FaUser,
    },
  ],
  navTertiary: [
    {
      title: 'Contato',
      url: '/contact',
      icon: FaPaperPlane,
    },
    {
      title: 'Ajuda',
      url: '/help',
      icon: FaQuestion,
    },
  ],
};

export function AppSidebar({ ...props }) {
  // obter a role do usuário logado
  const { user } = useAuth();
  const userRole = user ? user.role : null; // pega a role, ou null se não houver

  // definir a lógica de permissão
  // define quais roles têm acesso à gestão de usuários
  const ALLOWED_ROLES_FOR_USERS = ['admin', 'manager'];

  // filtrar a lista de navegação
  const filteredNavMain = data.navMain.filter((item) => {
    // se o item não for o link de usuários, ele é sempre incluído
    if (item.url !== '/users') {
      return true;
    }

    // se for o link de usuários, checa se a role do usuário é permitida
    return ALLOWED_ROLES_FOR_USERS.includes(userRole);
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavTertiary items={data.navTertiary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
