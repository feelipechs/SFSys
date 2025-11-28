import { BadRequestError } from '../utils/errorUtils.js';
import { DataValidator } from '../utils/validator.js';

// validação de formato e regras básicas
function validateDonorFormat(req, res, next) {
  const data = req.body;

  // validação de campos obrigatórios
  if (!data.name || !data.email || !data.type) {
    return next(
      new BadRequestError('Os campos nome, email e tipo são obrigatórios.'),
    );
  }

  // validação de formato (base)
  if (data.email && !DataValidator.isValidEmail(data.email)) {
    return next(new BadRequestError('Formato de e-mail inválido.'));
  }
  if (
    data.phone &&
    data.phone.length > 0 &&
    !DataValidator.isValidPhone(data.phone)
  ) {
    return next(
      new BadRequestError(
        'Formato de telefone inválido. Use o padrão brasileiro.',
      ),
    );
  }

  // validação de CPF (pessoa física)
  if (data.type === 'individual' && data.individual && data.individual.cpf) {
    if (!DataValidator.isValidCPF(data.individual.cpf)) {
      return next(
        new BadRequestError(
          'CPF inválido ou não passou na checagem algorítmica.',
        ),
      );
    }
  }

  // validação de CNPJ (pessoa jurídica)
  if (data.type === 'legal' && data.legal && data.legal.cnpj) {
    if (!DataValidator.isValidCNPJ(data.legal.cnpj)) {
      return next(
        new BadRequestError(
          'CNPJ inválido ou não passou na checagem algorítmica.',
        ),
      );
    }
  }

  // se tudo estiver ok, passa para o próximo middleware/controller
  next();
}

// validação de idade mínima
function validateMinimumAge(req, res, next) {
  const data = req.body;
  if (
    data.type === 'individual' &&
    data.individual &&
    data.individual.dateOfBirth
  ) {
    const birthDateString = data.individual.dateOfBirth;
    const minAge = 14;

    const today = new Date();
    const birthDate = new Date(birthDateString);
    const dateMinAge = new Date(birthDate);
    dateMinAge.setFullYear(birthDate.getFullYear() + minAge);

    if (today < dateMinAge) {
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return next(
        new BadRequestError(`O Doador PF deve ter no mínimo ${minAge} anos.`),
      );
    }
  }
  next();
}

export { validateDonorFormat, validateMinimumAge };
