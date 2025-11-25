import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { BeneficiaryEditCell } from './BeneficiaryEditCell';
import {
  formatDate,
  formatDocument,
  formatFullAddress,
} from '@/utils/formatters';

const BeneficiarySchema = {
  id: 0,
  responsibleName: '',
  responsibleCpf: '',
  registrationDate: '',
  address: {
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    street: '',
    number: '',
    complement: '',
  },
  familyMembersCount: 0,
};

const columnHelper = createColumnHelper(BeneficiarySchema);

export const beneficiaryColumns = [
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

  columnHelper.accessor('id', {
    header: 'ID',
  }),

  columnHelper.accessor('responsibleName', {
    header: 'Nome do Responsável',
  }),

  columnHelper.accessor('responsibleCpf', {
    header: 'CPF do Responsável',
    cell: ({ getValue }) => {
      const formattedDocument = getValue();
      return formatDocument(formattedDocument);
    },
    meta: {
      exportValue: (row) => formatDocument(row.responsibleCpf),
    },
  }),

  columnHelper.accessor('registrationDate', {
    header: 'Data de Cadastro',
    cell: ({ getValue }) => {
      const formattedDate = getValue();
      return formatDate(formattedDate);
    },
    meta: {
      exportValue: (row) => formatDate(row.registrationDate),
    },
  }),

  columnHelper.accessor((row) => formatFullAddress(row.address), {
    id: 'address',
    header: 'Endereço',

    cell: ({ row }) => {
      const fullAddress = formatFullAddress(row.original.address);

      return (
        <div className="flex max-w-[250px] items-center">
          <span className="truncate" title={fullAddress}>
            {fullAddress}
          </span>
        </div>
      );
    },

    enableColumnFilter: true,
    filterFn: 'includesString',
    meta: {
      exportValue: (row) => formatFullAddress(row.address),
    },
  }),

  columnHelper.accessor('familyMembersCount', {
    header: 'Membros na Família',
  }),

  columnHelper.display({
    id: 'actions',
    header: () => 'Ações',
    cell: ({ row }) => {
      return <BeneficiaryEditCell beneficiary={row.original} />;
    },
    enableSorting: false,
    size: 60,
    meta: {
      exportable: false,
    },
  }),
];
