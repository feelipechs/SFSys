/**
 * Funções de Formatação de Data e Hora
 *
 * Este módulo contém funções utilitárias para converter strings ISO 8601
 * em formatos legíveis pelo usuário, usando o padrão brasileiro,
 * mas **ignorando o fuso horário local** para garantir que a hora
 * visualizada seja exatamente a hora registrada (padrão 'local-as-utc').
 */

/**
 * Formata a string ISO 8601 (incluindo data e hora) para o padrão brasileiro
 * DD/MM/YYYY HH:MM, usando os métodos UTC para evitar o deslocamento de fuso horário.
 *
 * @param {string | null | undefined} isoString A string de data/hora ISO 8601 do banco de dados (ex: '2025-01-01T10:30:00.000Z').
 * @returns {string} A data e hora formatadas (ex: '01/01/2025 10:30') ou '-'.
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return '-';

  // Cria o objeto Date. Como a string termina em 'Z', a data é internamente UTC.
  const date = new Date(isoString);

  // Função auxiliar para garantir que o número tenha dois dígitos
  const pad = (num) => String(num).padStart(2, '0');

  // Extrai as partes da data usando os métodos UTC
  const day = pad(date.getUTCDate());
  const month = pad(date.getUTCMonth() + 1); // +1 pois getUTCMonth é 0-indexado
  const year = date.getUTCFullYear();

  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());

  // Constrói a string formatada: DD/MM/YYYY HH:MM
  return `${day}/${month}/${year}, ${hours}:${minutes}`;
};

/**
 * Formata a string ISO 8601 (incluindo data e hora) apenas para o padrão brasileiro
 * de data DD/MM/YYYY, usando os métodos UTC para evitar o deslocamento de fuso horário.
 *
 * @param {string | null | undefined} isoString A string de data/hora ISO 8601 do banco de dados (ex: '2025-01-01T10:30:00.000Z').
 * @returns {string} A data formatada (ex: '01/01/2025') ou '-'.
 */
export const formatDate = (isoString) => {
  if (!isoString) return '-';

  // Cria o objeto Date. Como a string geralmente é 'local-as-utc' (termina em 'Z' ou é tratada como UTC),
  // a data é internamente UTC.
  const date = new Date(isoString);

  // Função auxiliar para garantir que o número tenha dois dígitos (e.g., '01' em vez de '1')
  const pad = (num) => String(num).padStart(2, '0');

  // Extrai as partes da data usando os métodos UTC (ignorando a hora)
  const day = pad(date.getUTCDate());
  const month = pad(date.getUTCMonth() + 1); // +1 pois getUTCMonth é 0-indexado
  const year = date.getUTCFullYear();

  // Constrói a string formatada: DD/MM/YYYY
  return `${day}/${month}/${year}`;
};

/**
 * Remove todos os caracteres não numéricos de uma string.
 * @param {string | null | undefined} value
 * @returns {string} A string contendo apenas dígitos.
 */
const cleanNonDigits = (value) => {
  if (!value) return '';
  return String(value).replace(/\D/g, '');
};

/**
 * Formata um número de documento (CPF ou CNPJ) com base no seu comprimento.
 * @param {string | number | null | undefined} doc O número do CPF (11 dígitos) ou CNPJ (14 dígitos).
 * @returns {string} O documento formatado (CPF: 000.000.000-00, CNPJ: 00.000.000/0000-00) ou '-'.
 */
export const formatDocument = (doc) => {
  const cleaned = cleanNonDigits(doc);

  if (!cleaned) return '-';

  switch (cleaned.length) {
    case 11: // CPF: 000.000.000-00
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    case 14: // CNPJ: 00.000.000/0000-00
      return cleaned.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    default:
      // Retorna o valor limpo se não for nem CPF nem CNPJ
      return cleaned;
  }
};

/**
 * Formata um número de telefone com base no seu comprimento (geralmente 10 ou 11 dígitos, incluindo DDD).
 *
 * @param {string | number | null | undefined} phone O número de telefone (com DDD).
 * @returns {string} O telefone formatado (ex: (85) 99999-8888 ou (85) 3333-4444) ou '-'.
 */
export const formatPhone = (phone) => {
  const cleaned = cleanNonDigits(phone);

  if (!cleaned) return '-';

  // 11 dígitos: (XX) XXXXX-XXXX (Celular/com 9º dígito)
  if (cleaned.length === 11) {
    // DDD (2 dígitos) + 9º dígito (1 dígito) + 4 dígitos + 4 dígitos
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  // 10 dígitos: (XX) XXXX-XXXX (Telefone fixo ou celular antigo)
  if (cleaned.length === 10) {
    // DDD (2 dígitos) + 4 dígitos + 4 dígitos
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  // Se não corresponder a 10 ou 11 dígitos, retorna o valor limpo
  return cleaned;
};

/**
 * Formata um objeto de endereço completo
 * @param {Object} address - Objeto com dados do endereço
 * @returns {string} Endereço formatado
 */
export const formatFullAddress = (address) => {
  if (!address) return '';

  const formattedCep = formatCEP(address.cep); // Chama sua função formatCEP

  const parts = [
    address.street,
    address.number && `nº ${address.number}`,
    address.complement,
    address.neighborhood,
    address.city,
    address.state,
    formattedCep, // 👈 INCLUÍDO AQUI
  ].filter(Boolean);

  return parts.join(', ');
};

/**
 * Formata CEP no padrão brasileiro
 * @param {string} cep - CEP sem formatação
 * @returns {string} CEP formatado (00000-000)
 */
export const formatCEP = (cep) => {
  if (!cep) return '';

  const cleanCEP = cep.replace(/\D/g, '');

  if (cleanCEP.length !== 8) return cep;

  return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Formata endereço resumido (rua + número)
 * @param {Object} address - Objeto com dados do endereço
 * @returns {string} Endereço resumido
 */
export const formatShortAddress = (address) => {
  if (!address) return '';

  const parts = [
    address.street,
    address.number && `nº ${address.number}`,
  ].filter(Boolean);

  return parts.join(', ');
};

/**
 * Formata cidade e estado
 * @param {Object} address - Objeto com dados do endereço
 * @returns {string} Cidade - Estado
 */
export const formatCityState = (address) => {
  if (!address) return '';

  const parts = [address.city, address.state].filter(Boolean);

  return parts.join(' - ');
};

/**
 * Corrige a exibição da hora da notificação subtraindo 3 horas (offset de Brasília)
 * do valor UTC que foi incorretamente salvo (Ex: 13:39Z deve ser exibido como 10:39).
 * Replicamos a lógica de formatação de formatters.js, mas com o ajuste.
 *
 * @param {string | null | undefined} isoString A string de data/hora ISO 8601.
 * @returns {string} A data e hora formatadas (ex: '01/01/2025 10:30') ou '-'.
 */
export const formatCompensatedDateTime = (isoString) => {
  if (!isoString) return '-';

  const date = new Date(isoString);

  // Subtração de 3 horas em milissegundos (3h * 60m * 60s * 1000ms)
  const BRASILIA_OFFSET_MS = 3 * 60 * 60 * 1000;

  // Cria uma nova data compensada (-3 horas)
  const compensatedDate = new Date(date.getTime() - BRASILIA_OFFSET_MS);

  // Função auxiliar (copiada do seu formatDateTime)
  const pad = (num) => String(num).padStart(2, '0');

  // Extrai as partes da data usando os métodos UTC da data COMPENSADA.
  const day = pad(compensatedDate.getUTCDate());
  const month = pad(compensatedDate.getUTCMonth() + 1);
  const year = compensatedDate.getUTCFullYear();

  const hours = pad(compensatedDate.getUTCHours());
  const minutes = pad(compensatedDate.getUTCMinutes());

  return `${day}/${month}/${year}, ${hours}:${minutes}`;
};
