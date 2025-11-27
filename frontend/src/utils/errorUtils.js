/**
 * Extrai a melhor mensagem de erro de um objeto de erro do Axios/TanStack Query.
 * @param {object} error O objeto de erro retornado pela mutação.
 * @returns {string} A mensagem de erro mais específica.
 */
export const getErrorMessage = (error) => {
  // tenta pegar a mensagem personalizada do backend (ex: erro 400)
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // tenta pegar uma mensagem genérica de erro de requisição (axios)
  if (error.message && error.message.includes('status code')) {
    // se for um erro de status, mas sem mensagem do backend, pode-se retornar algo genérico
    return `Erro de requisição: ${error.message}`;
  }

  // fallback para erros de rede, timeout, ou erros desconhecidos
  return 'Erro de rede ou servidor indisponível. Tente novamente.';
};
