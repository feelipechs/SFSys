import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DonorEditCell } from './DonorEditCell';

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

export const donorColumnsLegal = [
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

  columnHelper.accessor('legal.cnpj', {
    header: 'CNPJ',
    id: 'cnpj',
    cell: ({ getValue }) => {
      // valor já é legal.cnpj, só precisa de formatação futura
      const cnpjValue = getValue();
      return <span>{cnpjValue || 'N/A'}</span>;
    },
  }),

  columnHelper.accessor('legal.companyName', {
    header: 'Razão Social',
    id: 'companyName',
    cell: ({ getValue }) => {
      const companyNameValue = getValue();
      return <span>{companyNameValue || 'N/A'}</span>;
    },
  }),

  columnHelper.accessor('legal.tradeName', {
    header: 'Nome Fantasia',
    id: 'tradeName',
    cell: ({ getValue }) => {
      const tradeNameValue = getValue();
      return <span>{tradeNameValue || 'N/A'}</span>;
    },
  }),

  columnHelper.accessor('phone', {
    header: 'Telefone',
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
