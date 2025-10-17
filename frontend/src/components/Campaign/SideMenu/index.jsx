import React, { useState, useCallback } from 'react';
import {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import {
  FaCog,
  FaHandsHelping,
  FaHome,
  FaKey,
  FaQuestion,
} from 'react-icons/fa';

// -----------------------------------------------------
// Estrutura de dados (Pode ser transferida para um arquivo de configuração)
// -----------------------------------------------------
const menuItemsData = [
  { name: 'Dashboard', icon: FaHome, href: '/campanhas', hasSubMenu: false },
  {
    name: 'Minhas Campanhas',
    icon: FaHandsHelping,
    href: '/minhas-campanhas',
    hasSubMenu: true,
    subItems: [
      { name: 'Em Andamento', href: '/minhas-campanhas/andamento' },
      { name: 'Concluídos', href: '/minhas-campanhas/concluidos' },
      { name: 'Favoritos', href: '/minhas-campanhas/favoritos' },
    ],
  },
  {
    name: 'Configurações',
    icon: FaCog,
    href: '/configuracoes',
    hasSubMenu: true,
    subItems: [{ name: 'Perfil', href: '/configuracoes/perfil' }],
  },
  {
    name: 'Ajuda',
    icon: FaQuestion,
    href: '/ajuda',
    hasSubMenu: false,
  },
  {
    name: 'Admin',
    icon: FaKey,
    href: '/admin',
    hasSubMenu: true,
    subItems: [{ name: 'Gerenciamento', href: '/admin/gerenciamento' }],
  },
];

// O path ativo é hardcoded apenas para demonstração do estilo 'ativo'
const activePath = '/campanhas';

const SideMenu = () => {
  // Estado para controlar qual submenu está aberto (mantido para a interação de estilo)
  const [openSubMenu, setOpenSubMenu] = useState(null);

  // Função para alternar o submenu (mantida para a interação de estilo)
  const toggleSubMenu = useCallback((itemName) => {
    setOpenSubMenu((prev) => (prev === itemName ? null : itemName));
  }, []);

  // -----------------------------------------------------
  // Subcomponente: Item da Lista de Navegação
  // -----------------------------------------------------
  const NavItem = ({ item }) => {
    const isSubMenuOpen = openSubMenu === item.name;
    const isActive = item.href === activePath; // Apenas para demonstração de estilo

    // Classes base
    const baseClasses =
      'flex items-center p-3 rounded-lg transition duration-150 ease-in-out';

    // Classes de estado (ATIVO vs. INATIVO)
    const activeClasses =
      'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-semibold';
    const inactiveClasses =
      'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';

    // Cor do ícone
    const iconColor = isActive
      ? 'text-teal-600 dark:text-teal-400'
      : 'text-gray-500 dark:text-gray-400';

    // Apenas alterna o submenu (não navegamos com 'a' ou 'Link' se tiver submenu)
    const handleClick = (e) => {
      if (item.hasSubMenu) {
        e.preventDefault();
        toggleSubMenu(item.name);
      }
    };

    return (
      <li>
        <a
          href={item.href} // Mantido o href para a semântica de link
          className={`${baseClasses} ${
            isActive ? activeClasses : inactiveClasses
          }`}
          onClick={handleClick}
        >
          {item.icon && (
            <item.icon
              className={`h-5 w-5 mr-3 ${iconColor}`}
              aria-hidden="true"
            />
          )}
          <span className="flex-grow">{item.name}</span>
          {item.hasSubMenu &&
            (isSubMenuOpen ? (
              <ChevronUpIcon className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 ml-2" />
            ))}
        </a>

        {/* Submenus com Animação */}
        {item.hasSubMenu && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isSubMenuOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}
          >
            <ul className="pl-8 py-1 space-y-1">
              {item.subItems.map((subItem) => (
                <li key={subItem.name}>
                  {/* Link do Submenu */}
                  <a
                    href={subItem.href}
                    className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                  >
                    {subItem.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  };
  // -----------------------------------------------------

  return (
    // O menu é um container Fixo (w-64) com altura total (h-full)
    // As classes 'h-full' e 'w-64' são o estilo principal do sidebar
    <nav
      className={`
        w-64 h-full
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        flex-shrink-0 // Garante que ele mantenha sua largura em um layout flex
      `}
      aria-label="Menu Principal"
    >
      <div className="p-4 flex flex-col h-full">
        {/* Cabeçalho do Menu */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-xl font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            Sua Plataforma
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Navegação Principal
          </p>
        </div>

        {/* Lista de Links */}
        <ul className="space-y-2 flex-grow">
          {menuItemsData.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </ul>

        {/* Rodapé (Exemplo) */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {/* <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 mr-3"></div> */}
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                Usuário
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-400">
                Plano Iniciante
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideMenu;
