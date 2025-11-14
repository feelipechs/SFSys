import {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { setUnauthorizedErrorCallback } from '@/services/api';

// chaves de localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// criação do contexto
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // inicializa o estado lendo do localStorage, se houver
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLoggedIn = useMemo(() => !!token && !!user, [token, user]);

  // função para lidar com o login bem-sucedido
  const login = (userData, jwtToken) => {
    // armazena no estado do React
    setToken(jwtToken);
    setUser(userData);

    // armazena no localStorage para persistência (reloads de página)
    localStorage.setItem(TOKEN_KEY, jwtToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  // função para logout (useCallback para otimização)
  // modificar logout para incluir redirecionamento
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // redirecionar para a página de login
    navigate('/login');

    // opcional: ,ostrar uma mensagem ao usuário (ex: Toast), já tem no navuser
  }, [navigate]); // navigate é uma dependência do useCallback

  // injetar logout no Interceptor
  useEffect(() => {
    // garante que a função 'logout' (que inclui o navigate) será chamada sempre que o interceptor HTTP receber 401
    setUnauthorizedErrorCallback(logout);
  }, [logout]); // executa apenas quando a função 'logout' (usando useCallback) muda

  // valor que será fornecido para os componentes
  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      user,
      token,
      login,
      logout,
    }),
    [isLoggedIn, user, token, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// hook customizado para fácil acesso ao contexto
export const useAuth = () => useContext(AuthContext);
