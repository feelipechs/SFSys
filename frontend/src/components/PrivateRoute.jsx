import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// adiciona uma prop: allowedRoles (ex: ['admin', 'manager'])
export function PrivateRoute({ allowedRoles }) {
  const { isLoggedIn, user } = useAuth();

  // checagem de autenticação
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // checagem de autorização
  // se allowedRoles foi fornecido e a role do usuário não está na lista
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // feedback de erro (para o usuário saber por que foi bloqueado)
    toast.error('Acesso Negado', {
      description: 'Seu perfil não tem permissão para acessar esta área.',
    });

    // redireciona para a home
    return <Navigate to="/" replace />;
  }

  // se passou nas duas checagens, renderiza o conteúdo da rota filha
  return <Outlet />;
}
