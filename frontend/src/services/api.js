// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',
// });

// // variável para armazenar a função de logout que será injetada
// let onUnauthorizedError = () => {
//   // função padrão (fallback) que apenas loga um aviso
//   console.warn(
//     'Função de logout/redirecionamento não foi injetada no interceptor.'
//   );
// };

// /**
//  * Função para injetar a lógica de logout/redirecionamento de fora
//  * @param {function} callback - A função que limpa o estado e redireciona
//  */
// export const setUnauthorizedErrorCallback = (callback) => {
//   onUnauthorizedError = callback;
// };

// // interceptador de requisição (adiciona o token)
// api.interceptors.request.use(
//   (config) => {
//     // tenta obter o token do local storage
//     const token = localStorage.getItem('auth_token');

//     if (token) {
//       // se houver token, anexa-o ao cabeçalho Authorization
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // interceptador de resposta (tratamento de erros)
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       if (error.response.status === 401) {
//         // isso impede loops, mas é um bom lugar para forçar o logout
//         // não podemos chamar useAuth() aqui, pois este é um módulo JS puro
//         // o logout deve ser manipulado pelo contexto
//         console.error(
//           'Token expirado ou inválido. Considere forçar logout no componente principal.'
//         );

//         // chamada da função injetada
//         onUnauthorizedError();

//         // não é necessário retornar o erro para o componente se já estamos forçando o logout
//         // se retornar, o componente fará um tratamento de erro que não é mais necessário
//         // opcional: abortar a promise após o redirecionamento
//         return new Promise(() => {}); // retorna uma promise que nunca resolve/rejeita
//       }

//       // retorna o objeto de erro original do Axios
//       // permite que o `LoginForm` verifique `error.response.status`
//       return Promise.reject(error);
//     }

//     // erros sem resposta (rede, timeout, etc.)
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// variável para armazenar a função de logout que será injetada
let onUnauthorizedError = () => {
  // função padrão (fallback) que apenas loga um aviso, caso a função de logout não seja injetada
  console.warn(
    'Função de logout/redirecionamento não foi injetada no interceptor.'
  );
};

/**
 * Função para injetar a lógica de logout/redirecionamento de fora
 * @param {function} callback - A função que limpa o estado e redireciona
 */
export const setUnauthorizedErrorCallback = (callback) => {
  onUnauthorizedError = callback;
};

// interceptador de requisição (adiciona o token)
api.interceptors.request.use(
  (config) => {
    // tenta obter o token do local storage
    const token = localStorage.getItem('auth_token');

    // se houver token, anexa-o ao cabeçalho Authorization
    if (token) {
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
      // verifica se o erro é 401
      if (error.response.status === 401) {
        // verifica se a requisição que falhou é a de login
        const isLoginAttempt = error.config.url.includes('/auth/login');

        if (isLoginAttempt) {
          // se for uma falha de login (credenciais incorretas), apenas rejeitamos a Promise para que o componente mostre o erro
          return Promise.reject(error);
        }

        // se NÃO for a rota de login, o token expirou ou é inválido
        // força o logout
        onUnauthorizedError();

        // retorna uma Promise que nunca resolve/rejeita para abortar a requisição original
        return new Promise(() => {});
      }

      // retorna o objeto de erro original do Axios (para outros erros 4xx, 5xx)
      return Promise.reject(error);
    }

    // erros sem resposta (rede, timeout, etc.)
    return Promise.reject(error);
  }
);

export default api;
