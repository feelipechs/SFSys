import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './components/ThemeProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme="system" // Tema padrão (pode ser "light" ou "system")
      storageKey="vite-ui-theme" // Chave usada no localStorage
    >
      <App />
    </ThemeProvider>
  </StrictMode>
);
