import * as React from 'react'; // necessário para React.useMemo, useState, etc.
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { useCampaignsQuery } from '@/hooks/queries/useCampaignsQuery';
import { EntityDetailDrawer } from '@/components/EntityDetailDrawer';
import { IconPlus } from '@tabler/icons-react';
import { campaignColumns } from './CampaignColumns';
import { CampaignForm } from './CampaignForm';
import {
  LoadingContent,
  LoadingFail,
  NoContent,
} from '@/components/LoadingContent';

const campaignTabsData = [
  { label: 'Outline', value: 'outline' },
  { label: 'Past Performance', value: 'past-performance', badge: 3 },
  { label: 'Key Personnel', value: 'key-personnel', badge: 2 },
  { label: 'Focus Documents', value: 'focus-documents' },
];

const campaignExtraTabsContent = [
  {
    value: 'past-performance',
    component: <div>Conteúdo da Aba: Lista de Pessoal Chave</div>,
  },
  {
    value: 'key-personnel',
    component: <div>Conteúdo da Aba: Lista de Pessoal Chave</div>,
  },
  {
    value: 'focus-documents',
    component: <div>Conteúdo da Aba: Lista de Documentos</div>,
  },
];

function CampaignManagement() {
  const {
    data: campaigns,
    isLoading,
    isError,
    dataUpdatedAt,
  } = useCampaignsQuery();
  // controle de estado para abrir/fechar o Drawer
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false);

  const FORM_ID = 'campaign-form';

  const createButton = (
    <EntityDetailDrawer
      title="Criar Nova Campanha"
      description="Preencha os dados da nova campanha para criar um registro."
      formId={FORM_ID}
      open={isCreateDrawerOpen}
      onOpenChange={setIsCreateDrawerOpen}
      triggerContent={
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Adicionar Nova Campanha</span>
        </Button>
      }
    >
      <CampaignForm
        formId={FORM_ID}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
    </EntityDetailDrawer>
  );

  if (isLoading) return <LoadingContent>campanhas</LoadingContent>;

  if (isError) return <LoadingFail>campanhas</LoadingFail>;

  if (!campaigns || campaigns.length === 0)
    return <NoContent createComponent={createButton}>campanhas</NoContent>;

  return (
    <div className="p-4">
      <DataTable
        key={dataUpdatedAt}
        data={campaigns}
        columns={campaignColumns}
        tabsData={campaignTabsData}
        mainActionComponent={createButton}
        extraTabsContent={campaignExtraTabsContent}
      />
    </div>
  );
}

export default CampaignManagement;
