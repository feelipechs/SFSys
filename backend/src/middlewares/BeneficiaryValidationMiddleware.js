import { BadRequestError } from '../utils/errorUtils.js';
import { DataValidator } from '../utils/validator.js';

export function validateBeneficiaryData(req, res, next) {
  const data = req.body;

  if (req.method === 'POST') {
    if (
      !data.responsibleName ||
      !data.responsibleCpf ||
      !data.registrationDate ||
      !data.cep ||
      !data.familyMembersCount
    ) {
      return next(
        new BadRequestError(
          'Os campos Nome do Responsável, CPF, Data de Cadastro, CEP e Número de Membros da Família são obrigatórios.',
        ),
      );
    }
  }

  if (data.responsibleCpf) {
    if (!DataValidator.isValidCPF(data.responsibleCpf)) {
      return next(
        new BadRequestError(
          'CPF inválido ou não passou na checagem algorítmica.',
        ),
      );
    }
  }

  if (data.cep) {
    const cleanCEP = data.cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) {
      return next(new BadRequestError('CEP inválido. Deve conter 8 dígitos.'));
    }
  }

  if (
    data.familyMembersCount !== undefined &&
    data.familyMembersCount !== null
  ) {
    const count = Number(data.familyMembersCount);

    if (isNaN(count) || count < 1 || !Number.isInteger(count)) {
      return next(
        new BadRequestError(
          'O Número de Membros da Família deve ser um número inteiro, positivo e no mínimo 1 (um).',
        ),
      );
    }
  }

  next();
}
