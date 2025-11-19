import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { useDonationsQuery } from '@/hooks/queries/useDonationsQuery';
import { EntityDetailDrawer } from '@/components/EntityDetailDrawer';
import { IconPlus } from '@tabler/icons-react';
import { donationColumns } from './DonationColumns';
import { DonationForm } from './DonationForm';
import {
  LoadingContent,
  LoadingFail,
  NoContent,
} from '@/components/LoadingContent';

const donationTabsData = [{ label: 'Doações', value: 'first' }];

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

  if (isLoading) return <LoadingContent>doações</LoadingContent>;

  if (isError) return <LoadingFail>doações</LoadingFail>;

  if (!donations || donations.length === 0)
    return <NoContent createComponent={createButton}>doações</NoContent>;

  return (
    <div className="p-4">
      <DataTable
        key={dataUpdatedAt}
        data={donations}
        columns={donationColumns}
        tabsData={donationTabsData}
        mainActionComponent={createButton}
      />
    </div>
  );
}

export default DonationManagement;
