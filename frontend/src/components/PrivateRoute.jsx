import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// adiciona uma prop: allowedRoles (ex: ['admin', 'manager'])
export function PrivateRoute({ allowedRoles }) {
  const { isLoggedIn, user } = useAuth();

  // 1. Checagem de Autenticação (Ação padrão)
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // checagem de autorização
  // se allowedRoles foi fornecido E a role do usuário NÃO está na lista
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
