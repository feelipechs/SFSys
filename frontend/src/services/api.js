import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // envia cookies automaticamente
});

let onUnauthorizedError = () => {
  console.warn(
    'Função de logout/redirecionamento não foi injetada no interceptor.'
  );
};

export const setUnauthorizedErrorCallback = (callback) => {
  onUnauthorizedError = callback;
};

// variável para evitar múltiplas tentativas simultâneas de refresh
let isRefreshing = false;
let failedRequestsQueue = [];

// interceptador de requisição (adiciona o access token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token'); // access token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptador de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      // se for 401 e não for a rota de login
      if (error.response.status === 401) {
        const isLoginAttempt = originalRequest.url.includes('/auth/login');
        const isRefreshAttempt = originalRequest.url.includes('/auth/refresh');

        // se for falha no login, apenas rejeita
        if (isLoginAttempt) {
          return Promise.reject(error);
        }

        // se for falha no refresh, faz logout
        if (isRefreshAttempt) {
          onUnauthorizedError();
          return new Promise(() => {});
        }

        // evita múltiplas requisições de refresh simultâneas
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const { data } = await api.post('/auth/refresh');

            // salva o novo access token
            localStorage.setItem('auth_token', data.accessToken);
            // atualiza o header da requisição original
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

            // processa todas as requisições que estavam esperando
            failedRequestsQueue.forEach((callback) =>
              callback(data.accessToken)
            );
            failedRequestsQueue = [];

            // refaz a requisição original
            return api(originalRequest);
          } catch (refreshError) {
            // refresh falhou, faz logout
            failedRequestsQueue = [];
            onUnauthorizedError();
            return new Promise(() => {});
          } finally {
            isRefreshing = false;
          }
        }

        // enfileira requisições enquanto está renovando o token
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
export default api;
