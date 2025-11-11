import { useQuery } from '@tanstack/react-query';
import UserService from '@/services/userService';

// dados mock para ver a tabela funcionando (pode ser removido ou mantido comentado)
const mockUsers = [
  { id: 1, name: 'João Silva', email: 'joao.s@gestao.com', role: 'Admin' },
  { id: 2, name: 'Maria Souza', email: 'maria.s@gestao.com', role: 'Gerente' },
  {
    id: 3,
    name: 'Pedro Alves',
    email: 'pedro.a@gestao.com',
    role: 'Voluntário',
  },
];

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],

    // linha pra mock
    // queryFn: () => new Promise((resolve) => setTimeout(() => resolve(mockUsers), 500)),

    // linha pra api
    queryFn: UserService.findAll,
  });
};
