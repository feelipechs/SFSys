import { createContext, useState, useContext, useEffect, useMemo } from 'react';

// Chaves de localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Criação do Contexto
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Inicializa o estado lendo do localStorage, se houver
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLoggedIn = useMemo(() => !!token && !!user, [token, user]);

  // Função para lidar com o login bem-sucedido
  const login = (userData, jwtToken) => {
    // 1. Armazena no estado do React
    setToken(jwtToken);
    setUser(userData);

    // 2. Armazena no Local Storage para persistência (reloads de página)
    localStorage.setItem(TOKEN_KEY, jwtToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  // Função para logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // O valor que será fornecido para os componentes
  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      user,
      token,
      login,
      logout,
    }),
    [isLoggedIn, user, token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Hook customizado para fácil acesso ao contexto
export const useAuth = () => useContext(AuthContext);
