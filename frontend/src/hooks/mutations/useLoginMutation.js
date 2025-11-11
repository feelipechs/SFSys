import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/errorUtils';

// função de chamada à API
// esta função será executada pelo useMutation
const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);

  // backend retorna { message, data: { user, token } }
  // dados limpos para o onSuccess do hook
  return response.data.data;
};

// o hook customizado de mutation
export const useLoginMutation = () => {
  // obtém a função login do contexto para salvar o estado global
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser, // função que faz a requisição

    onSuccess: (data) => {
      // chama o login do contexto: salva o token e os dados do usuário no estado e localStorage
      login(data.user, data.token);

      // feedback pro usuário
      toast.success(`Bem-vindo, ${data.user.name}!`, {
        description: 'Login realizado com sucesso. Redirecionando...',
        duration: 2000,
      });

      // o redirecionamento (ex: para a Dashboard) será feito no componente de Login
    },

    onError: (error) => {
      const customMessage = getErrorMessage(error);

      // forma que lida com a api.js anterior
      // exibe a mensagem de erro que veio do interceptor do Axios
      // const errorMessage =
      // error.message || 'Erro desconhecido. Não foi possível conectar.';

      toast.error('Falha no Login.', {
        description: customMessage,
        duration: 3000,
      });
      console.error('Erro de login:', error);
    },
  });
};
