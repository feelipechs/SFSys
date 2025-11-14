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
  }),

  columnHelper.accessor('id', {
    header: 'ID',
    size: 40,
  }),

  columnHelper.accessor('name', {
    header: 'Nome',
  }),

  columnHelper.accessor('document', {
    header: 'CPF',
    id: 'document',
    cell: ({ row }) => {
      const documentValue = row.original.individual
        ? row.original.individual.cpf
        : '';

      return <span>{documentValue || 'N/A'}</span>;
    },
  }),

  // exemplo quando aplicar formatador
  // columnHelper.accessor('individual.cpf', {
  //   header: 'CPF',
  //   id: 'cpf',
  //   cell: ({ getValue }) => {
  //     // Pega o valor diretamente da estrutura aninhada (individual.cpf)
  //     const cpfValue = getValue();

  //     // Aplica a formatação
  //     return <span>{formatCpf(cpfValue)}</span>;
  //   },
  //   size: 150,
  // }),

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
