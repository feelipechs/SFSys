/* eslint-disable no-unused-vars */
import React from 'react';
import {
  UserCircleIcon,
  CogIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

// Componente de Item de Navegação
const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <li
    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200
      ${
        isActive
          ? 'bg-indigo-600 text-white dark:bg-indigo-700'
          : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
      }
    `}
    onClick={onClick}
  >
    <Icon className="h-5 w-5 mr-3" />
    <span className="font-medium">{label}</span>
  </li>
);

const SettingsNav = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="md:w-1/4">
      <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-4 transition-colors duration-300">
        <ul>
          <NavItem
            icon={UserCircleIcon}
            label="Perfil"
            isActive={activeSection === 'Perfil'}
            onClick={() => setActiveSection('Perfil')}
          />
          <NavItem
            icon={LockClosedIcon}
            label="Segurança"
            isActive={activeSection === 'Segurança'}
            onClick={() => setActiveSection('Segurança')}
          />
          <NavItem
            icon={CogIcon}
            label="Geral"
            isActive={activeSection === 'Geral'}
            onClick={() => setActiveSection('Geral')}
          />
        </ul>
      </div>
    </nav>
  );
};

export default SettingsNav;
