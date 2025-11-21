import * as React from 'react'; // necessário para React.useMemo, useState, etc.
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';
import { EntityDetailDrawer } from '@/components/EntityDetailDrawer';
import { IconPlus } from '@tabler/icons-react';
import { userColumns } from './UserColumns';
import { UserForm } from './UserForm';
import {
  LoadingContent,
  LoadingFail,
  NoContent,
} from '@/components/LoadingContent';

// definição dos dados das abas
const userTabsData = [
  // o value deve ser outline para a aba da tabela principal
  { label: 'Usuários', value: 'outline' },
];

function UserManagement() {
  const { data: users, isLoading, isError, dataUpdatedAt } = useUsersQuery();
  // controle de estado para abrir/fechar o Drawer
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false);

  const FORM_ID = 'user-form'; // id único para o formulário

  const createButton = (
    <EntityDetailDrawer
      title="Criar Novo Usuário"
      description="Preencha os dados do novo usuário para criar um registro."
      formId={FORM_ID} // id do formulário
      open={isCreateDrawerOpen} // estado de controle
      onOpenChange={setIsCreateDrawerOpen} // permite que o usuário feche o Drawer
      triggerContent={
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Adicionar Novo Usuário</span>
        </Button>
      }
    >
      {/* passa o id e a função de fechar */}
      <UserForm formId={FORM_ID} onClose={() => setIsCreateDrawerOpen(false)} />
    </EntityDetailDrawer>
  );

  // tratamento de carregamento (isLoading)
  if (isLoading) return <LoadingContent>usuários</LoadingContent>;

  if (isError) return <LoadingFail>usuários</LoadingFail>;

  // tratamento de erro (isError)
  // se houver um erro (como o 401), o `isError` será true
  if (!users || users.length === 0)
    return <NoContent createComponent={createButton}>usuários</NoContent>;

  // renderiza a tabela
  return (
    <div className="p-4">
      {/* DataTable recebe o array users.
        O 'key' abaixo é opcional, mas garante que o DataTable
        seja reconstruído quando os dados mudam.
      */}
      <DataTable
        key={dataUpdatedAt}
        data={users}
        columns={userColumns}
        tabsData={userTabsData}
        mainActionComponent={createButton}
        entityName="users"
        sheetName="Usuários"
        pdfTitle="Relatório de Usuários"
      />
    </div>
  );
}

export default UserManagement;
