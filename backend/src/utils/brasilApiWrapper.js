const REQUEST_TIMEOUT = 5000;

/**
 * Busca informações de endereço pelo CEP usando a API oficial da Brasil API v2.
 * @param {string} rawCep - CEP para buscar.
 * @returns {Promise<Object>} Dados do endereço padronizados.
 * @throws {Error} Erros com 'cause' (400, 404, 500).
 */
export async function fetchCep(rawCep) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const cleanCEP = rawCep.replace(/\D/g, '');

  if (cleanCEP.length !== 8) {
    // 400 - validação de entrada
    clearTimeout(timeoutId);
    throw new Error('CEP deve conter 8 dígitos.', { cause: 400 });
  }

  try {
    const url = `https://brasilapi.com.br/api/cep/v2/${cleanCEP}`;

    const response = await fetch(url, { signal: controller.signal });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      // 404 - CEP não encontrado
      throw new Error('CEP não encontrado na Brasil API.', { cause: 404 });
    }

    if (!response.ok) {
      // 400, 500 ou outro erro
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        // se não for JSON, usamos o status
      }

      const message =
        errorBody?.message ||
        `Erro na API externa (Status: ${response.status})`;
      throw new Error(message, { cause: response.status });
    }

    // 200 - sucesso
    const data = await response.json();

    return {
      cep: data.cep,
      state: data.state,
      city: data.city,
      neighborhood: data.neighborhood || null,
      street: data.street,
      latitude: data.location?.coordinates?.latitude
        ? parseFloat(data.location.coordinates.latitude)
        : null,
      longitude: data.location?.coordinates?.longitude
        ? parseFloat(data.location.coordinates.longitude)
        : null,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      // 500 - Timeout (AbortController)
      throw new Error(`Busca de CEP expirou após ${REQUEST_TIMEOUT / 1000}s.`, {
        cause: 500,
      });
    }

    // outros erros de rede
    const statusCode =
      error.cause && typeof error.cause === 'number' ? error.cause : 500;
    throw new Error(error.message, { cause: statusCode });
  }
}
