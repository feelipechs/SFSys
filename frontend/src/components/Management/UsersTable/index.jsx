import { FaPencilAlt, FaTrash, FaPlus } from 'react-icons/fa';

const usersData = [
  {
    id: 'u1',
    name: 'Usuario 01',
    email: 'usuario.01@email.com',
    registrationDate: '17/10/2025',
    campaigns: [
      { id: 'c1', title: 'Campanha 01', description: '...' },
      { id: 'c2', title: 'Campanha 02', description: '...' },
    ],
  },
  {
    id: 'u2',
    name: 'Usuario 02',
    email: 'usuario.02@email.com',
    registrationDate: '17/10/2025',
    campaigns: [{ id: 'c3', title: 'Campanha 03', description: '...' }],
  },
];

const UserRow = ({ user }) => {
  const { name, email, registrationDate, campaigns } = user;

  return (
    <tr className="*:text-gray-900 *:first:font-medium dark:*:text-white">
      <td className="px-3 py-2 whitespace-nowrap">{name}</td>
      <td className="px-3 py-2 whitespace-nowrap">{email}</td>
      <td className="px-3 py-2 whitespace-nowrap">{registrationDate}</td>

      <td className="px-3 py-2 whitespace-nowrap">
        {campaigns.map((campaign) => campaign.title).join(', ')}
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

const UsersTable = () => {
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
            <th className="px-3 py-2 whitespace-nowrap">E-mail</th>
            <th className="px-3 py-2 whitespace-nowrap">Data de Cadastro</th>
            <th className="px-3 py-2 whitespace-nowrap">Campanhas</th>
            <th className="px-3 py-2 whitespace-nowrap">Gerenciar</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 *:even:bg-gray-50 dark:divide-gray-700 dark:*:even:bg-gray-800">
          {usersData.map((user) => (
            <UserRow
              key={user.id} // Use algo único como 'key' (ex: email, id)
              user={user}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
