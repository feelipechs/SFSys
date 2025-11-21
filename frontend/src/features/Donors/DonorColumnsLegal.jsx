import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DonorEditCell } from './DonorEditCell';
import { formatDocument, formatPhone } from '@/utils/formatters';

const DonorSchema = {
  id: 0,
  type: '',
  name: '',
  phone: '',
  email: '',
  individual: { donorId: 0, cpf: '', dateOfBirth: '' },
  legal: { donorId: 0, cnpj: '', tradeName: '', companyName: '' },
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
    meta: {
      exportable: false,
    },
  }),

  columnHelper.accessor('id', {
    header: 'ID',
  }),

  columnHelper.accessor('name', {
    header: 'Nome',
  }),

  columnHelper.accessor('legal.cnpj', {
    header: 'CNPJ',
    id: 'cnpj',
    cell: ({ getValue }) => {
      const formattedDocument = getValue();
      return formatDocument(formattedDocument);
    },
    meta: {
      exportValue: (row) => formatDocument(row.legal.cnpj),
    },
  }),

  columnHelper.accessor('legal.companyName', {
    header: 'Razão Social',
    id: 'companyName',
    cell: ({ getValue }) => {
      const companyName = getValue();
      return <span>{companyName || 'N/A'}</span>;
    },
    meta: {
      exportValue: (row) => {
        return row.legal?.companyName;
      },
    },
  }),

  columnHelper.accessor('legal.tradeName', {
    header: 'Nome Fantasia',
    id: 'tradeName',
    cell: ({ getValue }) => {
      const tradeNameValue = getValue();
      return <span>{tradeNameValue || 'N/A'}</span>;
    },
    meta: {
      exportValue: (row) => {
        return row.legal?.tradeName || '';
      },
    },
  }),

  columnHelper.accessor('phone', {
    header: 'Telefone',
    cell: ({ getValue }) => {
      const rawPhone = getValue();
      return formatPhone(rawPhone);
    },
    meta: {
      exportValue: (row) => {
        return formatPhone(row.phone);
      },
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
    meta: {
      exportable: false,
    },
  }),
];
