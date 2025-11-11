/**
 * Extrai a melhor mensagem de erro de um objeto de erro do Axios/TanStack Query.
 * @param {object} error O objeto de erro retornado pela mutação.
 * @returns {string} A mensagem de erro mais específica.
 */
export const getErrorMessage = (error) => {
  // 1. Tenta pegar a mensagem personalizada do backend (ex: erro 400)
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // 2. Tenta pegar uma mensagem genérica de erro de requisição (Axios)
  if (error.message && error.message.includes('status code')) {
    // Se for um erro de status, mas sem mensagem do backend, pode-se retornar algo genérico
    return `Erro de requisição: ${error.message}`;
  }

  // 3. Fallback para erros de rede, timeout, ou erros desconhecidos.
  return 'Erro de rede ou servidor indisponível. Tente novamente.';
};
