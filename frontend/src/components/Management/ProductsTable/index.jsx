import { FaPencilAlt, FaTrash, FaPlus } from 'react-icons/fa';

const productsData = [
  {
    id: 'p1',
    name: 'Produto 01',
    description: 'Descrição do Produto 01',
    registrationDate: '17/10/2025',
    quantity: 10,
    validity: '17/10/2025',
    donations: [
      { id: 'd1', title: 'Doação 01', description: '...' },
      { id: 'd2', title: 'Doação 02', description: '...' },
    ],
  },
  {
    id: 'p2',
    name: 'Produto 02',
    description: 'Descrição do Produto 02',
    registrationDate: '17/10/2025',
    quantity: 10,
    validity: '17/10/2025',
    donations: [{ id: 'd3', title: 'Doação 03', description: '...' }],
  },
];

const ProductRow = ({ product }) => {
  const { name, description, registrationDate, quantity, validity, donations } =
    product;

  return (
    <tr className="*:text-gray-900 *:first:font-medium dark:*:text-white">
      <td className="px-3 py-2 whitespace-nowrap">{name}</td>
      <td className="px-3 py-2 whitespace-nowrap">{description}</td>
      <td className="px-3 py-2 whitespace-nowrap">{registrationDate}</td>
      <td className="px-3 py-2 whitespace-nowrap">{quantity}</td>
      <td className="px-3 py-2 whitespace-nowrap">{validity}</td>

      <td className="px-3 py-2 whitespace-nowrap">
        {donations.map((donation) => donation.title).join(', ')}
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

const ProductsTable = () => {
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
            <th className="px-3 py-2 whitespace-nowrap">Nome</th>
            <th className="px-3 py-2 whitespace-nowrap">Descrição</th>
            <th className="px-3 py-2 whitespace-nowrap">Data de Cadastro</th>
            <th className="px-3 py-2 whitespace-nowrap">Quantidade</th>
            <th className="px-3 py-2 whitespace-nowrap">Validade</th>
            <th className="px-3 py-2 whitespace-nowrap">Gerenciar</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 *:even:bg-gray-50 dark:divide-gray-700 dark:*:even:bg-gray-800">
          {productsData.map((product) => (
            <ProductRow
              key={product.id} // Use algo único como 'key' (ex: email, id)
              product={product}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
