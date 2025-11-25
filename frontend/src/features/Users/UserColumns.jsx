import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { UserEditCell } from './UserEditCell';

// definição do tipo de dados (Schema)
const UserSchema = {
  id: 0,
  name: '',
  email: '',
  role: '',
};

const columnHelper = createColumnHelper(UserSchema);

// Mapeamento de Roles (Perfis) para Português
const roleMap = {
  admin: 'Administrador',
  manager: 'Gerente',
  volunteer: 'Voluntário',
  // original como fallback se não encontrar
  default: (role) => role.charAt(0).toUpperCase() + role.slice(1),
};

// array principal de colunas
export const userColumns = [
  // coluna select (checkbox)
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      exportable: false,
    },
  }),

  // coluna id
  columnHelper.accessor('id', {
    header: 'ID',
  }),

  // coluna nome
  columnHelper.accessor('name', {
    header: 'Nome do Usuário',
  }),

  // coluna email
  columnHelper.accessor('email', {
    header: 'Email',
  }),

  // coluna perfil
  columnHelper.accessor('role', {
    header: 'Perfil',
    id: 'role',

    // accessorFn para obter o valor traduzido
    accessorFn: (row) => {
      const role = row.role;
      return roleMap[role] || roleMap.default(role);
    },

    // a célula agora pode simplesmente pegar o valor processado pelo accessorFn
    cell: ({ getValue }) => {
      const translatedRole = getValue(); // pega o valor traduzido do accessorFn

      return <span>{translatedRole}</span>;
    },
    meta: {
      exportValue: (row) => {
        const role = row.role;
        // retorna o valor traduzido para o arquivo de exportação
        return roleMap[role] || roleMap.default(role);
      },
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: () => 'Ações',
    cell: ({ row }) => {
      // passa o objeto usuário inteiro para a célula de edição
      return <UserEditCell user={row.original} />;
    },
    enableSorting: false,
    size: 60,
    meta: {
      exportable: false,
    },
  }),
];
