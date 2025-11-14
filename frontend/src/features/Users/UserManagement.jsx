import * as React from 'react'; // necessário para React.useMemo, useState, etc.
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { ChartAreaInteractive } from '@/components/ChartAreaInteractive';
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';
import { EntityDetailDrawer } from '@/components/EntityDetailDrawer';
import { IconPlus } from '@tabler/icons-react';
import { userColumns } from './UserColumns';
import { UserForm } from './UserForm';

// definição dos dados das abas
const userTabsData = [
  // o value deve ser outline para a aba da tabela principal
  { label: 'Outline', value: 'outline' },
  { label: 'Past Performance', value: 'past-performance', badge: 3 }, // badge é opcional
  { label: 'Key Personnel', value: 'key-personnel', badge: 2 },
  { label: 'Focus Documents', value: 'focus-documents' },
];

// definição do conteúdo para abas extras
const userExtraTabsContent = [
  // define o que cada aba renderiza
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
  if (isLoading) return <div className="p-4">Carregando Usuários...</div>;

  // tratamento de erro (isError)
  // se houver um erro (como o 401), o `isError` será true
  if (isError)
    return (
      <div className="p-4 text-red-600">
        Erro ao carregar usuários. Verifique a autenticação ou o backend.
      </div>
    );

  // tratamento de dados nulos (users == null)
  // o TanStack Query só chega aqui se a promessa resolveu
  // mas é bom tratar se `users` for null ou undefined (se a API retornar 200, mas sem corpo)
  if (!users)
    return <div className="p-4">Nenhum dado de usuário encontrado.</div>;

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
        extraTabsContent={userExtraTabsContent}
      />
    </div>
  );
}

export default UserManagement;
