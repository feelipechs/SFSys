import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { ChartAreaInteractive } from '@/components/ChartAreaInteractive';
import { useDistributionsQuery } from '@/hooks/queries/useDistributionsQuery';
import { EntityDetailDrawer } from '@/components/EntityDetailDrawer';
import { IconPlus } from '@tabler/icons-react';
import { distributionColumns } from './DistributionColumns';
import { DistributionForm } from './DistributionForm';

const distributionTabsData = [
  { label: 'Outline', value: 'outline' },
  { label: 'Past Performance', value: 'past-performance', badge: 3 },
  { label: 'Key Personnel', value: 'key-personnel', badge: 2 },
  { label: 'Focus Documents', value: 'focus-documents' },
];

const distributionExtraTabsContent = [
  {
    value: 'past-performance',
    component: (
      <div className="pt-4">
        <h2>Tendência de Cadastros</h2>
        <ChartAreaInteractive />
      </div>
    ),
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

function DistributionManagement() {
  const {
    data: distributions,
    isLoading,
    isError,
    dataUpdatedAt,
  } = useDistributionsQuery();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false);

  const FORM_ID = 'distribution-form';

  const createButton = (
    <EntityDetailDrawer
      title="Criar Nova Distribuição"
      description="Preencha os dados da nova distribuição para criar um registro."
      formId={FORM_ID}
      open={isCreateDrawerOpen}
      onOpenChange={setIsCreateDrawerOpen}
      triggerContent={
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Adicionar Nova Distribuição</span>
        </Button>
      }
    >
      <DistributionForm
        formId={FORM_ID}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
    </EntityDetailDrawer>
  );

  if (isLoading) return <div className="p-4">Carregando Distribuições...</div>;

  if (isError)
    return (
      <div className="p-4 text-red-600">
        Erro ao carregar distribuições. Verifique a autenticação ou o backend.
      </div>
    );

  if (!distributions)
    return <div className="p-4">Nenhum dado de distribuição encontrado.</div>;

  return (
    <div className="p-4">
      <DataTable
        key={dataUpdatedAt}
        data={distributions}
        columns={distributionColumns}
        tabsData={distributionTabsData}
        mainActionComponent={createButton}
        extraTabsContent={distributionExtraTabsContent}
      />
    </div>
  );
}

export default DistributionManagement;
