'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
} from 'lucide-react';

import { GoPackageDependents } from 'react-icons/go';
import { MdFamilyRestroom } from 'react-icons/md';
import {
  FaHandsHelping,
  FaHandHoldingHeart,
  FaPeopleCarry,
  FaUser,
} from 'react-icons/fa';

import { NavMain } from '@/layouts/DashboardLayout/NavMain';
import { NavSecondary } from '@/layouts/DashboardLayout/NavSecondary';
import { NavProjects } from '@/layouts/DashboardLayout/NavProjects';
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
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Beneficiários',
      url: '/beneficiaries',
      icon: MdFamilyRestroom,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Campanhas',
      url: '/campaigns',
      icon: FaHandsHelping,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Distribuições',
      url: '/distributions',
      icon: GoPackageDependents,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Doações',
      url: '/donations',
      icon: FaHandHoldingHeart,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
    {
      title: 'Doadores',
      url: '/donors',
      icon: FaPeopleCarry,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
    {
      title: 'Usuários',
      url: '/users',
      icon: FaUser,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: Frame,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: Frame,
    },
    {
      title: 'Search',
      url: '#',
      icon: Frame,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
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
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
