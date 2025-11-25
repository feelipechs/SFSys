import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductEditCell } from './ProductEditCell';

const ProductSchema = {
  id: 0,
  name: '',
  unitOfMeasurement: '',
  currentStock: 0,
  category: '',
};

const columnHelper = createColumnHelper(ProductSchema);

const categoryTranslations = {
  food: 'Alimento',
  clothing: 'Vestimenta',
  hygiene: 'Higiene',
  others: 'Outros',
};

// função para traduzir, com fallback para capitalização
const translateCategory = (category) => {
  if (!category) return 'N/A';
  const lowerCategory = category.toLowerCase();

  // ,retorna a tradução ou o original capitalizado se não encontrar
  return (
    categoryTranslations[lowerCategory] ||
    category.charAt(0).toUpperCase() + category.slice(1)
  );
};

// mapeamento de unidades de medida para português
const unitMap = {
  kg: 'Kilo',
  l: 'Litro',
  un: 'Unidade',
  default: (unit) => unit.charAt(0).toUpperCase() + unit.slice(1),
};

const translateUnit = (unit) => {
  if (!unit) return 'N/A';
  const lowerUnit = unit.toLowerCase();

  return unitMap[lowerUnit] || unit.charAt(0).toUpperCase() + unit.slice(1);
};

export const productColumns = [
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

  columnHelper.accessor('name', {
    header: 'Nome',
  }),

  columnHelper.accessor('unitOfMeasurement', {
    header: 'Unidade de Medida',
    id: 'unitOfMeasurement',
    accessorFn: (row) => translateUnit(row.unitOfMeasurement),

    cell: ({ getValue }) => {
      const translatedUnit = getValue();
      return <span>{translatedUnit}</span>;
    },

    meta: {
      exportValue: (row) => translateUnit(row.unitOfMeasurement),
    },
  }),

  columnHelper.accessor('currentStock', {
    header: 'Estoque Atual',
  }),

  columnHelper.accessor('category', {
    header: 'Categoria',
    id: 'category',

    accessorFn: (row) => translateCategory(row.category),

    cell: ({ getValue }) => {
      const translatedCategory = getValue();
      return <span>{translatedCategory}</span>;
    },

    meta: {
      exportValue: (row) => translateCategory(row.category),
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: () => 'Ações',
    cell: ({ row }) => {
      return <ProductEditCell product={row.original} />;
    },
    enableSorting: false,
    size: 60,
    meta: {
      exportable: false,
    },
  }),
];
