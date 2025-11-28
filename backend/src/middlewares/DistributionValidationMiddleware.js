import { BadRequestError } from '../utils/errorUtils.js';

export function validateDistributionPayload(req, res, next) {
  const data = req.body;
  const { items, ...distributionBaseData } = data;

  if (req.method === 'POST') {
    if (!items || items.length === 0) {
      return next(
        new BadRequestError(
          'A distribuição deve conter pelo menos um item (produto e quantidade).',
        ),
      );
    }

    if (
      !distributionBaseData.dateTime ||
      !distributionBaseData.beneficiaryId ||
      !distributionBaseData.responsibleUserId
    ) {
      return next(
        new BadRequestError(
          'Campos obrigatórios (data/hora, beneficiário e usuário responsável) devem ser fornecidos.',
        ),
      );
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return next(
          new BadRequestError(
            'Cada item da distribuição deve ter um productId e uma quantity positiva.',
          ),
        );
      }
    }
  }

  if (req.method === 'PUT') {
    if (items) {
      return next(
        new BadRequestError(
          'Não é permitido atualizar a lista de itens (produtos e quantidades) de uma distribuição existente. Apenas dados do cabeçalho podem ser modificados.',
        ),
      );
    }

    if (Object.keys(distributionBaseData).length === 0) {
      return next(
        new BadRequestError(
          'Nenhum campo válido fornecido para atualização do cabeçalho da distribuição.',
        ),
      );
    }
  }

  next();
}
