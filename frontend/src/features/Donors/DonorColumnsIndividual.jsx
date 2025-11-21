import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DonorEditCell } from './DonorEditCell';
import { formatDate, formatDocument, formatPhone } from '@/utils/formatters';

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

export const donorColumnsIndividual = [
  // Coluna de Seleção
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

  columnHelper.accessor('individual.cpf', {
    header: 'CPF',
    id: 'cpf',
    cell: ({ getValue }) => {
      const formattedDocument = getValue();
      return formatDocument(formattedDocument);
    },
    meta: {
      exportValue: (row) => formatDocument(row.individual.cpf),
    },
  }),

  columnHelper.accessor('individual.dateOfBirth', {
    header: 'Data de Nascimento',
    id: 'dateOfBirth',
    cell: ({ getValue }) => {
      const formattedDate = getValue();
      return formatDate(formattedDate);
    },
    meta: {
      exportValue: (row) => formatDate(row.individual.dateOfBirth),
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
