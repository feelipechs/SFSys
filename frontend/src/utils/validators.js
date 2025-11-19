import { cpf, cnpj } from 'cpf-cnpj-validator';

// 1. REGEX E CONSTANTES
const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

const PHONE_RAW_REGEX = /^\d{10,13}$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const PASSWORD_LOWERCASE_REGEX = /(?=.*[a-z])/; // Deve conter pelo menos uma letra minúscula
const PASSWORD_UPPERCASE_REGEX = /(?=.*[A-Z])/; // Deve conter pelo menos uma letra maiúscula
const PASSWORD_NUMBER_REGEX = /(?=.*\d)/; // Deve conter pelo menos um dígito
const PASSWORD_SYMBOL_REGEX = /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`])/; // Deve conter pelo menos um símbolo

// 2. FUNÇÕES DE VALIDAÇÃO (Adaptadas para o RHF)
export const FormValidators = {
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

  /**
   * Valida a complexidade da senha.
   * Verifica comprimento, maiúsculas, minúsculas e caracteres especiais.
   */
  password: (value) => {
    // 1. Permite que o RHF lide com 'required: true'
    if (!value) return true;

    // 2. Comprimento Mínimo
    if (value.length < PASSWORD_MIN_LENGTH) {
      return `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
    }

    // comprimento máximo
    if (value.length > PASSWORD_MAX_LENGTH) {
      return `A senha não pode exceder ${PASSWORD_MAX_LENGTH} caracteres.`;
    }

    // 3. Letra Minúscula
    if (!PASSWORD_LOWERCASE_REGEX.test(value)) {
      return 'A senha deve conter pelo menos uma letra minúscula.';
    }

    // 4. Letra Maiúscula
    if (!PASSWORD_UPPERCASE_REGEX.test(value)) {
      return 'A senha deve conter pelo menos uma letra maiúscula.';
    }

    // 5. Número
    if (!PASSWORD_NUMBER_REGEX.test(value)) {
      return 'A senha deve conter pelo menos um número.';
    }

    // 6. Símbolo (opcional, mas recomendado)
    if (!PASSWORD_SYMBOL_REGEX.test(value)) {
      return 'A senha deve conter pelo menos um símbolo (!, @, #, etc.).';
    }

    return true;
  },

  /**
   * Valida se a senha de confirmação corresponde à senha original.
   * (Esta função é usada diretamente no FormField, não é um validador simples)
   */
  confirmPassword: (value, formValues) => {
    // formValues é o segundo argumento passado pelo RHF para validações no nível do formulário/campo
    if (value !== formValues.password) {
      return 'As senhas não coincidem.';
    }
    return true;
  },
};
