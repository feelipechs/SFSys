import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/errorUtils';

// função de chamada à API
const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  // backend retorna { user, accessToken, refreshToken } refresh agora é cookie
  return response.data.data;
};

// o hook customizado de mutation
export const useLoginMutation = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // passa os 2 parâmetros: user, accessToken
      login(data.user, data.accessToken);

      toast.success(`Bem-vindo, ${data.user.name}!`, {
        description: 'Login realizado com sucesso. Redirecionando...',
        duration: 2000,
      });
    },
    onError: (error) => {
      const customMessage = getErrorMessage(error);

      toast.error('Falha no Login.', {
        description: customMessage,
        duration: 3000,
      });

      console.error('Erro de login:', error);
    },
  });
};
