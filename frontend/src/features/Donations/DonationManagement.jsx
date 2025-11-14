import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { ChartAreaInteractive } from '@/components/ChartAreaInteractive';
import { useDonationsQuery } from '@/hooks/queries/useDonationsQuery';
import { EntityDetailDrawer } from '@/components/EntityDetailDrawer';
import { IconPlus } from '@tabler/icons-react';
import { donationColumns } from './DonationColumns';
import { DonationForm } from './DonationForm';

const donationTabsData = [
  { label: 'Outline', value: 'outline' },
  { label: 'Past Performance', value: 'past-performance', badge: 3 },
  { label: 'Key Personnel', value: 'key-personnel', badge: 2 },
  { label: 'Focus Documents', value: 'focus-documents' },
];

const donationExtraTabsContent = [
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

function DonationManagement() {
  const {
    data: donations,
    isLoading,
    isError,
    dataUpdatedAt,
  } = useDonationsQuery();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false);

  const FORM_ID = 'donation-form';

  const createButton = (
    <EntityDetailDrawer
      title="Criar Nova Doação"
      description="Preencha os dados da nova doação para criar um registro."
      formId={FORM_ID}
      open={isCreateDrawerOpen}
      onOpenChange={setIsCreateDrawerOpen}
      triggerContent={
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Adicionar Nova Doação</span>
        </Button>
      }
    >
      <DonationForm
        formId={FORM_ID}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
    </EntityDetailDrawer>
  );

  if (isLoading) return <div className="p-4">Carregando Doações...</div>;

  if (isError)
    return (
      <div className="p-4 text-red-600">
        Erro ao carregar doações. Verifique a autenticação ou o backend.
      </div>
    );

  if (!donations)
    return <div className="p-4">Nenhum dado de doação encontrado.</div>;

  return (
    <div className="p-4">
      <DataTable
        key={dataUpdatedAt}
        data={donations}
        columns={donationColumns}
        tabsData={donationTabsData}
        mainActionComponent={createButton}
        extraTabsContent={donationExtraTabsContent}
      />
    </div>
  );
}

export default DonationManagement;
