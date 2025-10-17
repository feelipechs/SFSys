import React, { useState } from 'react';

import SettingsNav from '../../components/Profile/SettingsNav';
import ProfileSection from '../../components/Profile/ProfileSection';
import SecuritySection from '../../components/Profile/SecuritySection';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
// Importe GeneralSection se for usá-lo

const Profile = () => {
  // Estado que a Page gerencia para a navegação
  const [activeSection, setActiveSection] = useState('Perfil');

  const renderContent = () => {
    // Renderiza a seção correspondente
    switch (activeSection) {
      case 'Perfil':
        return <ProfileSection />;
      case 'Segurança':
        return <SecuritySection />;
      case 'Geral':
        // Substitua pelo seu componente GeneralSection
        return (
          <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 transition-colors duration-300">
            <h2
              className="text-2xl font-semibold mb-6 border-b pb-3 border-gray-200 dark:border-gray-800
                           text-gray-900 dark:text-white"
            >
              Configurações Gerais
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Esta é a seção Geral.
            </p>
          </div>
        );
      default:
        return <ProfileSection />;
    }
  };

  return (
    // Layout Principal da Página
    <div className="min-h-screen p-4 sm:p-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Configurações do Usuário
          </h1>
          <ThemeSwitcher />
        </header>
        <Link to="/campanhas" className="flex text-dark dark:text-white mt-3">
          <ArrowLeftIcon className="size-6" />
          <p>Voltar</p>
        </Link>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Componente de Navegação (Sidebar) */}
          <SettingsNav
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          {/* Área de Conteúdo */}
          <main className="md:w-3/4">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
