import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { useBeneficiariesQuery } from '@/hooks/queries/useBeneficiariesQuery';
import { EntityDetailDrawer } from '@/components/EntityDetailDrawer';
import { IconPlus } from '@tabler/icons-react';
import { beneficiaryColumns } from './BeneficiaryColumns';
import { BeneficiaryForm } from './BeneficiaryForm';
import {
  LoadingContent,
  LoadingFail,
  NoContent,
} from '@/components/LoadingContent';

const beneficiaryTabsData = [{ label: 'Beneficiários', value: 'outline' }];

function BeneficiaryManagement() {
  const {
    data: beneficiaries,
    isLoading,
    isError,
    dataUpdatedAt,
  } = useBeneficiariesQuery();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false);

  const FORM_ID = 'beneficiary-form';

  const createButton = (
    <EntityDetailDrawer
      title="Criar Novo Beneficiário"
      description="Preencha os dados do novo beneficiário para criar um registro."
      formId={FORM_ID}
      open={isCreateDrawerOpen}
      onOpenChange={setIsCreateDrawerOpen}
      triggerContent={
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Adicionar Novo Beneficiário</span>
        </Button>
      }
    >
      <BeneficiaryForm
        formId={FORM_ID}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
    </EntityDetailDrawer>
  );

  if (isLoading) return <LoadingContent>beneficiários</LoadingContent>;

  if (isError) return <LoadingFail>beneficiários</LoadingFail>;

  if (!beneficiaries || beneficiaries.length === 0)
    return <NoContent createComponent={createButton}>beneficiários</NoContent>;

  return (
    <div className="p-4">
      <DataTable
        key={dataUpdatedAt}
        data={beneficiaries}
        columns={beneficiaryColumns}
        tabsData={beneficiaryTabsData}
        mainActionComponent={createButton}
        entityName="beneficiaries"
        sheetName="Beneficiários"
        pdfTitle="Relatório de Beneficiários"
      />
    </div>
  );
}

export default BeneficiaryManagement;
