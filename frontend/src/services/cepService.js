import api from './api';

export const cepService = {
  /**
   * Busca informações de endereço pelo CEP através da API própria
   * @param {string} cep - CEP sem formatação (apenas números)
   * @returns {Promise} Dados do endereço
   */
  async getByCep(cep) {
    // remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');

    if (cleanCEP.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }

    const { data } = await api.get(`/addresses/cep/${cleanCEP}`);

    return data;
  },
};
