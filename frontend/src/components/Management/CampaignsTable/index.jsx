import { FaPencilAlt, FaTrash, FaPlus } from 'react-icons/fa';

const campaignsData = [
  {
    id: 'c1',
    title: 'Campanha 01',
    description: 'Descrição da campanha 01',
    creationDate: '17/10/2025',
    products: [
      { id: 'p1', name: 'Product 01', description: '...' },
      { id: 'p2', name: 'Product 02', description: '...' },
    ],
  },
  {
    id: 'c2',
    title: 'Campanha 02',
    description: 'Descrição da campanha 02',
    creationDate: '17/10/2025',
    products: [{ id: 'p3', name: 'Product 03', description: '...' }],
  },
];

const CampaignRow = ({ campaign }) => {
  const { title, description, creationDate, products } = campaign;

  return (
    <tr className="*:text-gray-900 *:first:font-medium dark:*:text-white">
      <td className="px-3 py-2 whitespace-nowrap">{title}</td>
      <td className="px-3 py-2 whitespace-nowrap">{description}</td>
      <td className="px-3 py-2 whitespace-nowrap">{creationDate}</td>

      <td className="px-3 py-2 whitespace-nowrap">
        {products.map((product) => product.name).join(', ')}
      </td>

      <td className="px-3 py-2 whitespace-nowrap flex gap-2">
        <FaPencilAlt
          size={20}
          className="text-blue-500 hover:text-blue-700 cursor-pointer"
          title="Editar"
        />
        <FaTrash
          size={20}
          className="text-red-500 hover:text-red-700 cursor-pointer"
          title="Excluir"
        />
      </td>
    </tr>
  );
};

const CampaignsTable = () => {
  return (
    <div className="overflow-x-auto">
      <div className="teste justify-items-end">
        <FaPlus
          size={20}
          className="text-green-500 hover:text-green-700 cursor-pointer"
          title="Adicionar"
        />
      </div>
      <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-700">
        <thead className="ltr:text-left rtl:text-right">
          <tr className="*:font-medium *:text-gray-900 dark:*:text-white">
            <th className="px-3 py-2 whitespace-nowrap">Título</th>
            <th className="px-3 py-2 whitespace-nowrap">Descrição</th>
            <th className="px-3 py-2 whitespace-nowrap">Data de Criação</th>
            <th className="px-3 py-2 whitespace-nowrap">Produtos</th>
            <th className="px-3 py-2 whitespace-nowrap">Gerenciar</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 *:even:bg-gray-50 dark:divide-gray-700 dark:*:even:bg-gray-800">
          {campaignsData.map((campaign) => (
            <CampaignRow key={campaign.id} campaign={campaign} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsTable;
