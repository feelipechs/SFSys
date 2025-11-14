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
  }),

  // coluna id
  columnHelper.accessor('id', {
    header: 'ID',
    size: 50,
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
    header: 'Perfil', // Header em português
    id: 'role',

    // a célula é responsável por traduzir e renderizar o valor
    cell: ({ getValue }) => {
      const role = getValue(); // pega o valor original (ex: 'admin')
      const translatedRole = roleMap[role] || roleMap.default(role);

      return (
        <span
        // opcional:  estilo para destacar a role
        // className={role === 'admin' ? 'font-semibold text-blue-600' : ''}
        >
          {translatedRole}
        </span>
      );
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
  }),
];
