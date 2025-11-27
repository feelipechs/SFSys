import { cpf, cnpj } from 'cpf-cnpj-validator';

// regex e consts

// regex para e-mail (robusta, baseada em RFC 5322 simplificada)
const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

// regex para validar a sequência numérica do telefone (10 a 13 dígitos brutos)
// 10-11 dígitos (DDD + Número) ou 12-13 dígitos (55 + DDD + Número)
const PHONE_RAW_REGEX = /^\d{10,13}$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const PASSWORD_LOWERCASE_REGEX = /(?=.*[a-z])/; // pelo menos uma minúscula
const PASSWORD_UPPERCASE_REGEX = /(?=.*[A-Z])/; // pelo menos uma maiúscula
const PASSWORD_NUMBER_REGEX = /(?=.*\d)/; // pelo menos um dígito
const PASSWORD_SYMBOL_REGEX = /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`])/; // pelo menos um símbolo

// classes de validação
export class DataValidator {
  // validação de formato simples (email/telefone)

  /**
   * Valida o formato do email.
   * @param {string} email
   * @returns {boolean}
   */
  static isValidEmail(email) {
    if (!email) return true; // permite que o service verifique se é obrigatório
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

    // remove toda a formatação (parênteses, espaços, hífens)
    const rawNumber = phone.replace(/\D/g, '');

    // checa se o número de dígitos está entre 10 e 13
    if (!PHONE_RAW_REGEX.test(rawNumber)) {
      return false;
    }

    // se o número tiver 12 ou 13 dígitos, o DDI '55' deve ser o prefixo
    if (rawNumber.length > 11 && !rawNumber.startsWith('55')) {
      return false;
    }

    return true;
  }

  // validação de documentos (algorítmica)

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
    // a biblioteca cuida da limpeza da string e do cálculo algorítmico
    return cnpj.isValid(cnpjNumber);
  }

  /**
   * Valida a complexidade da senha.
   * @param {string} passwordValue - A senha a ser verificada.
   * @param {boolean} isRequired - Indica se a senha é obrigatória (padrão: true).
   * @returns {boolean} True se a senha é válida (ou vazia e opcional), false caso contrário.
   */
  static isValidPassword(passwordValue, isRequired = true) {
    // lidar com campos vazios
    if (!passwordValue || passwordValue.trim() === '') {
      return !isRequired; // retorna true se não for obrigatório, ou false se for
    }

    const password = passwordValue.trim();

    // comprimento mínimo
    if (password.length < PASSWORD_MIN_LENGTH) {
      return false;
    }

    // comprimento máximo
    if (password.length > PASSWORD_MAX_LENGTH) {
      return false;
    }

    // letra minúscula
    if (!PASSWORD_LOWERCASE_REGEX.test(password)) {
      return false;
    }

    // letra maiúscula
    if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
      return false;
    }

    // número
    if (!PASSWORD_NUMBER_REGEX.test(password)) {
      return false;
    }

    // símbolo
    if (!PASSWORD_SYMBOL_REGEX.test(password)) {
      return false;
    }

    return true;
  }
}
