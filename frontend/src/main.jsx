import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme="system" // tema padrão (pode ser "light" ou "system")
      storageKey="vite-ui-theme" // chave usada no localStorage
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
