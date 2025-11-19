import { createColumnHelper } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CampaignEditCell } from './CampaignEditCell';
import { Check, Loader2, XCircle, Clock } from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

// definição do tipo de dados (Schema)
const CampaignSchema = {
  id: 0,
  name: '',
  startDate: '',
  endDate: '',
  status: '',
};

const columnHelper = createColumnHelper(CampaignSchema);

const statusMap = {
  inProgress: {
    label: 'Em Andamento',
    variant: 'default',
    icon: <Loader2 className="mr-1 h-3 w-3 animate-spin" />,
    className: 'bg-blue-500 hover:bg-blue-500/80 text-white',
  },
  finished: {
    label: 'Finalizada',
    variant: 'default',
    icon: <Check className="mr-1 h-3 w-3" />,
    className: 'bg-green-500 hover:bg-green-500/80 text-white',
  },
  canceled: {
    label: 'Cancelada',
    variant: 'destructive',
    icon: <XCircle className="mr-1 h-3 w-3" />,
  },
  pending: {
    label: 'Pendente',
    variant: 'outline',
    icon: <Clock className="mr-1 h-3 w-3" />,
  },
};

export const campaignColumns = [
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

  columnHelper.accessor('name', {
    header: 'Nome da Campanha',
  }),

  columnHelper.accessor('startDate', {
    header: 'Data Inicial',
    // usa accessorFn para retornar o valor já formatado (DD/MM/YYYY HH:MM).
    accessorFn: (row) => formatDateTime(row.startDate),
    // a célula apenas exibe o valor retornado pelo accessorFn
    cell: ({ getValue }) => getValue(),
  }),

  columnHelper.accessor('endDate', {
    header: 'Data Final',
    accessorFn: (row) => formatDateTime(row.endDate),
    cell: ({ getValue }) => getValue(),
  }),

  columnHelper.accessor('status', {
    header: 'Status',
    id: 'status',

    // usa accessorFn para retornar o label traduzido
    // garante que o filtro global agora busque pela label
    accessorFn: (row) => {
      const statusKey = row.status;
      const config = statusMap[statusKey];
      return config ? config.label : statusKey; // retorna o label formatado para a pesquisa
    },

    cell: ({ row }) => {
      // row.original.status para obter a chave original ('inProgress'), que não foi modificada pelo accessorFn, permitindo buscar ícones e cores
      const statusKey = row.original.status;
      const config = statusMap[statusKey];

      // caso o status não esteja mapeado, apenas exibe a chave bruta
      if (!config) {
        return <span className="capitalize">{statusKey}</span>;
      }

      // renderiza o Badge usando a configuração
      return (
        <Badge variant={config.variant} className={config.className || ''}>
          {config.icon}
          {config.label}
        </Badge>
      );
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: () => 'Ações',
    cell: ({ row }) => {
      return <CampaignEditCell campaign={row.original} />;
    },
    enableSorting: false,
    size: 60,
  }),
];
