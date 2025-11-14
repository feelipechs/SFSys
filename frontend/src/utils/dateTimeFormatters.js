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
