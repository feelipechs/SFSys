import { BadRequestError } from '../utils/errorUtils.js';

const VALID_STATUS = ['inProgress', 'finished', 'canceled', 'pending'];

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date) && dateString !== undefined && dateString !== null;
};

export function validateCampaignData(req, res, next) {
  const data = req.body;

  if (req.method === 'POST') {
    if (
      !data.name ||
      !data.startDate ||
      !data.endDate ||
      !data.status ||
      !data.category
    ) {
      return next(
        new BadRequestError(
          'Todos os campos obrigatórios (nome, data de início, data de fim, status e categoria) devem ser preenchidos.',
        ),
      );
    }
  }

  if (data.status) {
    if (!VALID_STATUS.includes(data.status)) {
      return next(
        new BadRequestError(
          `O status fornecido "${data.status}" não é válido. Use um dos seguintes: ${VALID_STATUS.join(', ')}.`,
        ),
      );
    }
  }

  if (data.startDate && !isValidDate(data.startDate)) {
    return next(new BadRequestError('Formato da data de início é inválido.'));
  }

  if (data.endDate && !isValidDate(data.endDate)) {
    return next(new BadRequestError('Formato da data de término é inválido.'));
  }

  // esta checagem só faz sentido se ambas as datas estiverem presentes (ou sejam válidas)
  const startDate = data.startDate ? new Date(data.startDate) : null;
  const endDate = data.endDate ? new Date(data.endDate) : null;

  // se ambas as datas estão no payload, valida a ordem temporal
  if (startDate && endDate) {
    if (endDate < startDate) {
      return next(
        new BadRequestError(
          'A data de término não pode ser anterior à data de início da campanha.',
        ),
      );
    }
  }

  next();
}
