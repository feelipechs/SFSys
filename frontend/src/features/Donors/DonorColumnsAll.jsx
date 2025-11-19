import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DonorEditCell } from './DonorEditCell';
import { formatPhone } from '@/utils/formatters';

// mantém o DonorSchema original para tipagem
const DonorSchema = {
  id: 0,
  type: '',
  name: '',
  phone: '',
  email: '',
  individual: { donorId: 0, cpf: 0, dateOfBirth: '' },
  legal: { donorId: 0, cnpj: 0, tradeName: '', companyName: '' },
};

const columnHelper = createColumnHelper(DonorSchema);

const typeMap = {
  individual: 'Pessoa Física',
  legal: 'Pessoa Jurídica',
};

export const donorColumnsAll = [
  // coluna de seleção
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),

  columnHelper.accessor('id', {
    header: 'ID',
    size: 40,
  }),

  columnHelper.accessor('name', {
    header: 'Nome',
  }),

  columnHelper.accessor('type', {
    header: 'Entidade',
    id: 'type',
    cell: ({ getValue }) => {
      const type = getValue();
      const translatedType = typeMap[type] || type;

      return <span>{translatedType}</span>;
    },
  }),

  columnHelper.accessor('phone', {
    header: 'Telefone',
    cell: ({ getValue }) => {
      const rawPhone = getValue(); // obtém o valor puro (ex: "85999998888")

      // retorna o valor formatado (ex: "(85) 99999-8888")
      return formatPhone(rawPhone);
    },
  }),

  columnHelper.accessor('email', {
    header: 'Email',
  }),

  columnHelper.display({
    id: 'actions',
    header: () => 'Ações',
    cell: ({ row }) => {
      return <DonorEditCell donor={row.original} />;
    },
    enableSorting: false,
    size: 60,
  }),
];
