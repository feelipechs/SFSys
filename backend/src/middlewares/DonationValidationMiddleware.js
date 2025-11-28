import { BadRequestError } from '../utils/errorUtils.js';

export function validateDonationPayload(req, res, next) {
  const data = req.body;
  const { items, ...donationBaseData } = data;

  if (req.method === 'POST') {
    if (!items || items.length === 0) {
      return next(
        new BadRequestError(
          'A doação deve conter pelo menos um item (produto e quantidade).',
        ),
      );
    }

    if (!donationBaseData.donorId || !donationBaseData.responsibleUserId) {
      return next(
        new BadRequestError(
          'Os campos Doador e Usuário Responsável são obrigatórios.',
        ),
      );
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return next(
          new BadRequestError(
            'Cada item da doação deve ter um productId e uma quantity positiva.',
          ),
        );
      }
    }
  }

  if (req.method === 'PUT') {
    if (items) {
      return next(
        new BadRequestError(
          'Não é permitido atualizar a lista de itens (produtos e quantidades) de uma doação existente. Apenas dados do cabeçalho (observação, data e campanha) podem ser modificados.',
        ),
      );
    }

    if (Object.keys(donationBaseData).length === 0) {
      return next(
        new BadRequestError(
          'Nenhum campo válido fornecido para atualização do cabeçalho da doação.',
        ),
      );
    }
  }

  next();
}
