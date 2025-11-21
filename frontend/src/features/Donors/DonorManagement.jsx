import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { useDonorsQuery } from '@/hooks/queries/useDonorsQuery';
import { EntityDetailDrawer } from '@/components/EntityDetailDrawer';
import { IconPlus } from '@tabler/icons-react';
import { DonorForm } from './DonorForm';
import {
  LoadingContent,
  LoadingFail,
  NoContent,
} from '@/components/LoadingContent';

// conjunto de colunas
import { donorColumnsAll } from './DonorColumnsAll';
import { donorColumnsIndividual } from './DonorColumnsIndividual';
import { donorColumnsLegal } from './DonorColumnsLegal';

const TABS_DATA = [
  { label: 'Todos os Doadores', value: 'all-donors' },
  { label: 'Pessoa Física (PF)', value: 'pf-donors' },
  { label: 'Pessoa Jurídica (PJ)', value: 'pj-donors' },
];

function DonorManagement() {
  const { data: donors, isLoading, isError, dataUpdatedAt } = useDonorsQuery();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false);

  // estado para rastrear a aba ativa, padrão é 'all-donors'
  const [activeTab, setActiveTab] = React.useState('all-donors');

  const FORM_ID = 'donor-form';

  const filteredData = React.useMemo(() => {
    const allDonors = donors || [];

    if (activeTab === 'pf-donors') {
      return allDonors.filter((donor) => donor.type === 'individual');
    }
    if (activeTab === 'pj-donors') {
      return allDonors.filter((donor) => donor.type === 'legal');
    }
    return allDonors; // aba 'all-donors'
  }, [donors, activeTab]);

  // lógica de seleção de colunas
  const columnsToDisplay = React.useMemo(() => {
    if (activeTab === 'pf-donors') {
      return donorColumnsIndividual;
    }
    if (activeTab === 'pj-donors') {
      return donorColumnsLegal;
    }
    return donorColumnsAll; // aba 'all-donors'
  }, [activeTab]);

  // criação do botão de ação
  const createButton = (
    <EntityDetailDrawer
      title="Criar Novo Doador"
      description="Preencha os dados do novo doador para criar um registro."
      formId={FORM_ID}
      open={isCreateDrawerOpen}
      onOpenChange={setIsCreateDrawerOpen}
      triggerContent={
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Adicionar Novo Doador</span>
        </Button>
      }
    >
      <DonorForm
        formId={FORM_ID}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
    </EntityDetailDrawer>
  );

  if (isLoading) return <LoadingContent>doadores</LoadingContent>;

  if (isError) return <LoadingFail>doadores</LoadingFail>;

  if (!donors || donors.length === 0)
    return <NoContent createComponent={createButton}>doadores</NoContent>;

  return (
    <div className="p-4">
      <DataTable
        // a chave força o re-render do TanStack Table ao mudar de aba/dados, garantindo que os filtros/paginação sejam resetados corretamente
        key={dataUpdatedAt + activeTab}
        data={filteredData} // passa os dados filtrados
        columns={columnsToDisplay} // passa as colunas corretas
        tabsData={TABS_DATA}
        mainActionComponent={createButton}
        // DataTable notifica qual aba foi clicada
        onTabChange={setActiveTab}
        initialTabValue={activeTab}
        entityName="donors"
        sheetName="Doadores"
        pdfTitle="Relatório de Doadores"
      />
    </div>
  );
}

export default DonorManagement;
