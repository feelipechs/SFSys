import { useQuery } from '@tanstack/react-query';
import UserService from '@/services/userService';

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: UserService.findAll,
  });
};
