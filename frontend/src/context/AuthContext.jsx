import {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setUnauthorizedErrorCallback } from '@/services/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLoggedIn = useMemo(() => !!token && !!user, [token, user]);

  const login = (userData, accessToken) => {
    setToken(accessToken);
    setUser(userData);

    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  const updateUser = useCallback((updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUserData));
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // limpa tudo independentemente do resultado
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      navigate('/login');
    }
  }, [navigate]);

  // injeta logout no Interceptor
  useEffect(() => {
    setUnauthorizedErrorCallback(logout);
  }, [logout]);

  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      user,
      token,
      login,
      logout,
      updateUser,
    }),
    [isLoggedIn, user, token, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
