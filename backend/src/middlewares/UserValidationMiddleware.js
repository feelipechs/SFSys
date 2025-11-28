import { BadRequestError } from '../utils/errorUtils.js';
import { DataValidator } from '../utils/validator.js';

export function validateUserData(req, res, next) {
  const data = req.body;

  if (req.method === 'POST') {
    if (!data.email || !data.password || !data.name || !data.role) {
      return next(
        new BadRequestError(
          'Todos os campos obrigatórios (email, senha, nome, role) devem ser preenchidos.',
        ),
      );
    }
  }

  if (data.email) {
    if (!DataValidator.isValidEmail(data.email)) {
      return next(
        new BadRequestError('O formato do email fornecido é inválido.'),
      );
    }
  }

  if (data.password) {
    if (req.method === 'POST') {
      if (!DataValidator.isValidPassword(data.password, true)) {
        return next(
          new BadRequestError(
            'A senha não atende aos requisitos de segurança (min. 8 caracteres, maiúscula, minúscula, número e símbolo).',
          ),
        );
      }
    } else if (!DataValidator.isValidPassword(data.password, false)) {
      return next(
        new BadRequestError(
          'A nova senha não atende aos requisitos de segurança.',
        ),
      );
    }
  }
  next();
}
