import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// interceptador de requisição (adiciona o token)
api.interceptors.request.use(
  (config) => {
    // tenta obter o token do local storage
    const token = localStorage.getItem('auth_token');

    if (token) {
      // se houver token, anexa-o ao cabeçalho Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptador de resposta (tratamento de erros)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // isso impede loops, mas é um bom lugar para forçar o logout
        // não podemos chamar useAuth() aqui, pois este é um módulo JS puro
        // o logout deve ser manipulado pelo contexto
        console.error(
          'Token expirado ou inválido. Considere forçar logout no componente principal.'
        );
      }

      // retorna o objeto de erro original do Axios
      // permite que o `LoginForm` verifique `error.response.status`
      return Promise.reject(error);

      // outra forma de fazer, mas nao lidou muito bem com erros
      // const errorMessage =
      // error.response.data.message || 'Erro no servidor. Tente novamente.';
      // throw new Error(errorMessage);
    }

    // erros sem resposta (rede, timeout, etc.)
    return Promise.reject(error);
  }
);

export default api;
