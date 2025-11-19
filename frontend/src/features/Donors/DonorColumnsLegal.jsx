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
    cell: ({ row }) => {
      const documentValue = row.original.legal ? row.original.legal.cnpj : '';

      // verifica se o valor existe para evitar formatar 'N/A'
      if (!documentValue) {
        return <span>N/A</span>;
      }

      const formattedDocument = formatDocument(documentValue);

      return <span>{formattedDocument}</span>;
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
    cell: ({ getValue }) => {
      const rawPhone = getValue();

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
