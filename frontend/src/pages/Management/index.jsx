import React, { useState } from 'react';
// Importe seus novos componentes de tabela
// Se ainda não existirem, você precisará criá-los!
import UsersTable from '../../components/Management/UsersTable'; // Renomeado de StudentsTable
import CampaignsTable from '../../components/Management/CampaignsTable'; // Renomeado de CoursesTable
// Supondo que você criou:
import BeneficiariesTable from '../../components/Management/BeneficiariesTable';
import DonorsTable from '../../components/Management/DonorsTable';
import ProductsTable from '../../components/Management/ProductsTable';

import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ModeToggle } from '@/components/ModeToggle';

// 1. Objeto TABS completo
const TABS = {
  BENEFICIARIOS: 'beneficiarios',
  DOADORES: 'doadores',
  PRODUTOS: 'produtos',
  USUARIOS: 'usuarios',
  CAMPANHAS: 'campanhas',
};

// Mapeia os títulos dos botões para os valores do TABS
const TAB_CONFIG = [
  {
    name: 'Beneficiários',
    value: TABS.BENEFICIARIOS,
    component: <BeneficiariesTable />,
  },
  { name: 'Doadores', value: TABS.DOADORES, component: <DonorsTable /> },
  { name: 'Estoque', value: TABS.PRODUTOS, component: <ProductsTable /> },
  { name: 'Usuários', value: TABS.USUARIOS, component: <UsersTable /> },
  { name: 'Campanhas', value: TABS.CAMPANHAS, component: <CampaignsTable /> },
];

const Management = () => {
  // 2. Estado simples para a aba ativa
  const [activeTab, setActiveTab] = useState(TABS.BENEFICIARIOS);

  // 3. Função para aplicar classes de estilo
  const getButtonClasses = (tabName) => {
    // Classes básicas para todos os botões
    let classes =
      'py-2 px-4 text-sm font-medium transition-colors duration-200 rounded-md';

    if (activeTab === tabName) {
      // Classes para a aba ATIVA (fundo e texto em destaque)
      classes += ' bg-indigo-600 text-white shadow-md';
    } else {
      // Classes para abas INATIVAS
      classes +=
        ' text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700';
    }
    return classes;
  };

  // Encontra o componente para a aba ativa
  const ActiveComponent =
    TAB_CONFIG.find((tab) => tab.value === activeTab)?.component || null;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Painel de Gerenciamento
          </h1>
          <ModeToggle />
        </header>
        <Link
          to="/campanhas"
          className="flex items-center text-gray-700 dark:text-white mt-3 px-6"
        >
          <ArrowLeftIcon className="size-5 mr-1" />
          <p>Voltar</p>
        </Link>

        {/* --- CONTROLE SEGMENTADO SIMPLES --- */}
        <div className="p-6">
          <div className="flex flex-wrap gap-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-inner">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.value}
                className={getButtonClasses(tab.value)}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* --- Conteúdo Renderizado Condicionalmente --- */}
        <div className="px-6 pb-6">{ActiveComponent}</div>
      </div>
    </div>
  );
};

export default Management;
