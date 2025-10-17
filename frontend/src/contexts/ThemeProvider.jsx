/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Definições de Tipos (Opcional, mas bom para organização)
const THEMES = ['light', 'dark', 'system'];
const ThemeContext = createContext(); // O Contexto real

// Função para detectar a preferência do sistema
const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

// 2. O Componente Provedor
export const ThemeProvider = ({ children }) => {
  // theme = preferência do usuário ('light', 'dark', ou 'system')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  // effectiveTheme = tema real a ser aplicado ('light' ou 'dark')
  const [effectiveTheme, setEffectiveTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : getSystemTheme();
  });

  // Lógica de monitoramento e aplicação (igual ao hook anterior)
  useEffect(() => {
    const root = window.document.documentElement;
    let newEffectiveTheme = effectiveTheme;
    let mediaQueryListener;

    if (theme === 'system') {
      newEffectiveTheme = getSystemTheme();
      setEffectiveTheme(newEffectiveTheme);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQueryListener = (e) =>
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', mediaQueryListener);
    } else {
      newEffectiveTheme = theme;
      setEffectiveTheme(newEffectiveTheme);
    }

    // Aplica/Remove a classe 'dark' no <html>
    if (newEffectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Salva a PREFERÊNCIA do usuário no localStorage
    localStorage.setItem('theme', theme);

    return () => {
      if (mediaQueryListener) {
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .removeEventListener('change', mediaQueryListener);
      }
    };
  }, [theme]);

  // O valor que será disponibilizado para todos os componentes
  const contextValue = {
    theme, // 'light', 'dark', 'system' (o que o usuário escolheu)
    setTheme, // Função para o ThemeSwitcher
    effectiveTheme, // 'light' ou 'dark' (o que está ativo no CSS)
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. O Hook de Consumo (para usar o tema em qualquer lugar)
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
