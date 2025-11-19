import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DonationEditCell } from './DonationEditCell';
import { formatDateTime } from '@/utils/formatters';
import { MultiItemsCell } from '@/components/MultiItemsCell';
import { TruncatedTextCell } from '@/components/TruncatedTextCell';

const DonationSchema = {
  id: 0,
  dateTime: '',
  observation: '',
  donor: { id: '', name: '' },
  responsibleUser: { id: '', name: '' },
  campaign: { id: '', name: '' },
  items: [
    { productId: 0, quantity: 0, product: { name: '', unitOfMeasurement: '' } },
  ],
};

const columnHelper = createColumnHelper(DonationSchema);

export const donationColumns = [
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

  columnHelper.accessor('id', {
    header: 'ID',
    size: 50,
  }),

  columnHelper.accessor('dateTime', {
    header: 'Data e Hora',
    accessorFn: (row) => formatDateTime(row.dateTime),
    cell: ({ getValue }) => getValue(),
  }),

  columnHelper.accessor('donor.name', {
    // acessa o nome para ordenação padrão
    header: 'Doador',
    size: 50,
    cell: ({ row }) => {
      const donorName = row.original.donor?.name;
      const donorId = row.original.donorId;
      return (
        <span>
          {donorName || 'Desconhecido'} (ID: {donorId})
        </span>
      );
    },
  }),

  columnHelper.accessor('responsibleUser.name', {
    header: 'Usuário',
    cell: ({ row }) => {
      const userName = row.original.responsibleUser?.name || 'Desconhecido';
      const userId = row.original.responsibleUserId;

      // Constrói a string completa para o tooltip
      const fullText = `${userName} (ID: ${userId})`;

      return (
        <div className="flex max-w-[100px] items-center">
          <span className="truncate" title={fullText}>
            {fullText}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('campaign.name', {
    header: 'Campanha',
    cell: ({ row }) => {
      const campaign = row.original.campaign;
      const campaignName = campaign?.name || 'N/A';
      const campaignId = campaign?.id;

      const fullText = `${campaignName} ${
        campaignId ? `(ID: ${campaignId})` : ''
      }`;

      return (
        <div className="flex max-w-[100px] items-center">
          <span className="truncate" title={fullText}>
            {fullText}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor('items', {
    header: 'Produtos',
    id: 'itemsView',
    size: 90,
    accessorFn: (row) => row.items?.length || 0,
    cell: ({ row }) => {
      // passa as chaves específicas do modelo 'DonationItem'
      return (
        <MultiItemsCell
          items={row.original.items}
          headerLabel="Produto(s)" // rótulo na UI
          quantityKey="quantity" // chave no item
          productObjectKey="product" // chave do objeto aninhado
          productNameKey="name" // chave dentro do objeto 'product'
          productUnitKey="unitOfMeasurement" // chave da unidade
          validityKey="validity" // chave da validade (existe no DonationItem)
        />
      );
    },
    enableSorting: true,
  }),

  columnHelper.accessor('observation', {
    header: 'Observação',
    cell: ({ row }) => {
      const observationText = row.original.observation;
      return (
        <TruncatedTextCell text={observationText} headerLabel="Observação" />
      );
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: () => 'Ações',
    cell: ({ row }) => {
      return <DonationEditCell donation={row.original} />;
    },
    enableSorting: false,
    size: 60,
  }),
];
