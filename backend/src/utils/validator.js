// Importação das bibliotecas externas para validação algorítmica de documentos
import { cpf, cnpj } from 'cpf-cnpj-validator';

// 1. REGEX E CONSTANTES

// Regex para e-mail (robusta, baseada em RFC 5322 simplificada)
const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

// Regex para validar a sequência numérica do telefone (10 a 13 dígitos brutos)
// 10-11 dígitos (DDD + Número) ou 12-13 dígitos (55 + DDD + Número)
const PHONE_RAW_REGEX = /^\d{10,13}$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const PASSWORD_LOWERCASE_REGEX = /(?=.*[a-z])/; // Pelo menos uma minúscula
const PASSWORD_UPPERCASE_REGEX = /(?=.*[A-Z])/; // Pelo menos uma maiúscula
const PASSWORD_NUMBER_REGEX = /(?=.*\d)/; // Pelo menos um dígito
const PASSWORD_SYMBOL_REGEX = /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`])/; // Pelo menos um símbolo

// 2. CLASSE DE VALIDAÇÃO
export class DataValidator {
  // --- Validação de Formato Simples (Email/Telefone) ---

  /**
   * Valida o formato do email.
   * @param {string} email
   * @returns {boolean}
   */
  static isValidEmail(email) {
    if (!email) return true; // Permite que o Service verifique se é obrigatório
    return EMAIL_REGEX.test(email.trim());
  }

  /**
   * Valida a sequência de dígitos do telefone brasileiro.
   * Assume que a pontuação deve ser removida antes da checagem.
   * @param {string} phone
   * @returns {boolean}
   */
  static isValidPhone(phone) {
    if (!phone) return true;

    // Remove toda a formatação (parênteses, espaços, hífens)
    const rawNumber = phone.replace(/\D/g, '');

    // Checa se o número de dígitos está entre 10 e 13
    if (!PHONE_RAW_REGEX.test(rawNumber)) {
      return false;
    }

    // Se o número tiver 12 ou 13 dígitos, o DDI '55' deve ser o prefixo
    if (rawNumber.length > 11 && !rawNumber.startsWith('55')) {
      return false;
    }

    return true;
  }

  // --- Validação de Documentos (Algorítmica) ---

  /**
   * Valida CPF (Formato e Dígito Verificador).
   * @param {string} cpfNumber - O número do CPF (pode ser formatado ou não).
   * @returns {boolean}
   */
  static isValidCPF(cpfNumber) {
    if (!cpfNumber) return false;
    // A biblioteca cuida da limpeza da string e do cálculo algorítmico
    return cpf.isValid(cpfNumber);
  }

  /**
   * Valida CNPJ (Formato e Dígito Verificador).
   * @param {string} cnpjNumber - O número do CNPJ (pode ser formatado ou não).
   * @returns {boolean}
   */
  static isValidCNPJ(cnpjNumber) {
    if (!cnpjNumber) return false;
    // A biblioteca cuida da limpeza da string e do cálculo algorítmico
    return cnpj.isValid(cnpjNumber);
  }

  /**
   * Valida a complexidade da senha.
   * @param {string} passwordValue - A senha a ser verificada.
   * @param {boolean} isRequired - Indica se a senha é obrigatória (padrão: true).
   * @returns {boolean} True se a senha é válida (ou vazia e opcional), false caso contrário.
   */
  static isValidPassword(passwordValue, isRequired = true) {
    // 1. Lidar com campos vazios
    if (!passwordValue || passwordValue.trim() === '') {
      return !isRequired; // Retorna true se NÃO for obrigatório, ou false se for.
    }

    const password = passwordValue.trim();

    // 2. Comprimento Mínimo
    if (password.length < PASSWORD_MIN_LENGTH) {
      return false;
    }

    // 3. Comprimento Máximo
    if (password.length > PASSWORD_MAX_LENGTH) {
      return false;
    }

    // 4. Letra Minúscula
    if (!PASSWORD_LOWERCASE_REGEX.test(password)) {
      return false;
    }

    // 5. Letra Maiúscula
    if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
      return false;
    }

    // 6. Número
    if (!PASSWORD_NUMBER_REGEX.test(password)) {
      return false;
    }

    // 7. Símbolo
    if (!PASSWORD_SYMBOL_REGEX.test(password)) {
      return false;
    }

    return true;
  }
}
