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
    cell: ({ row }) => <span>{row.original.name}</span>,
  }),

  // coluna email
  columnHelper.accessor('email', {
    header: 'Email',
  }),

  // coluna perfil
  columnHelper.accessor('role', {
    header: 'Perfil',
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
