import { cpf, cnpj } from 'cpf-cnpj-validator';

// 1. REGEX E CONSTANTES
const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

const PHONE_RAW_REGEX = /^\d{10,13}$/;

// 2. FUNÇÕES DE VALIDAÇÃO (Adaptadas para o RHF)

export const FrontendValidators = {
  /**
   * Valida o formato do e-mail.
   * Retorna TRUE ou a mensagem de erro (string).
   */
  email: (value) => {
    // O 'required' do RHF deve lidar com o campo vazio, mas sempre bom verificar.
    if (!value) return true;

    // Testa o regex
    if (!EMAIL_REGEX.test(value.trim())) {
      return 'O formato do e-mail é inválido.';
    }
    return true;
  },

  /**
   * Valida a sequência de dígitos do telefone brasileiro.
   */
  phone: (value) => {
    if (!value) return true;

    const rawNumber = value.replace(/\D/g, '');

    if (!PHONE_RAW_REGEX.test(rawNumber)) {
      return 'O telefone deve ter entre 10 e 13 dígitos.';
    }

    if (rawNumber.length > 11 && !rawNumber.startsWith('55')) {
      return 'Para números com 12 ou 13 dígitos, o prefixo DDI (55) é obrigatório.';
    }

    return true;
  },

  /**
   * Valida CPF (Formato e Dígito Verificador).
   */
  cpf: (value) => {
    if (!value) return true;
    if (!cpf.isValid(value)) {
      return 'O CPF fornecido é inválido.';
    }
    return true;
  },

  /**
   * Valida CNPJ (Formato e Dígito Verificador).
   */
  cnpj: (value) => {
    if (!value) return true;
    if (!cnpj.isValid(value)) {
      return 'O CNPJ fornecido é inválido.';
    }
    return true;
  },
};
