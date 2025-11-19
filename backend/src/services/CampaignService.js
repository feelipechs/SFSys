import { BadRequestError, NotFoundError } from '../utils/api-error.js';

const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return 'Data Inválida';
  return date.toLocaleDateString('pt-BR');
};

class CampaignService {
  constructor(models) {
    if (
      !models ||
      !models.Campaign ||
      !models.Donation ||
      !models.Distribution ||
      !models.sequelize
    ) {
      throw new Error(
        'Modelos (Campaign, Donation, Distribution) e a instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    this.Campaign = models.Campaign;
    this.Donation = models.Donation;
    this.Distribution = models.Distribution;
    this.sequelize = models.sequelize;
  }

  async create(data) {
    if (!data.name || !data.startDate || !data.endDate || !data.status) {
      throw new BadRequestError(
        'Todos os campos obrigatórios (nome, data de início, data de fim e status) devem ser preenchidos.',
      );
    }

    // validação de datas
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const currentDate = new Date();

    // validação de unicidade do nome
    const existingCampaign = await this.Campaign.findOne({
      where: { name: data.name },
    });

    if (existingCampaign) {
      throw new BadRequestError(
        'Já existe uma campanha cadastrada com este nome.',
      );
    }

    if (endDate < startDate) {
      throw new BadRequestError(
        'A data de término não pode ser anterior à data de início da campanha.',
      );
    }

    const VALID_STATUS = ['inProgress', 'finished', 'canceled', 'pending'];
    if (!VALID_STATUS.includes(data.status)) {
      throw new BadRequestError(
        `O status fornecido "${data.status}" não é válido. Use um dos seguintes: ${VALID_STATUS.join(', ')}.`,
      );
    }

    if (endDate < currentDate) {
      // se a campanha já terminou (data de fim no passado), o status só pode ser 'finished' ou 'canceled'
      if (data.status !== 'finished' && data.status !== 'canceled') {
        throw new BadRequestError(
          `Campanhas com data de término no passado ${formatDate(endDate)}) devem ter status "finished" ou "canceled". O status atual é "${data.status}".`,
        );
      }
    } else if (startDate > currentDate) {
      // se a campanha ainda não começou (data de início no futuro), o status só pode ser 'pending' ou 'canceled'
      if (data.status !== 'pending' && data.status !== 'canceled') {
        throw new BadRequestError(
          `Campanhas futuras (início em ${formatDate(startDate)}) devem ter status "pending" ou "canceled". O status atual é "${data.status}".`,
        );
      }
    } else {
      // se a campanha está em andamento (data de início no passado/hoje e data de fim no futuro), a campanha está ativa, o status só pode ser 'inProgress' ou 'canceled'
      if (data.status !== 'inProgress' && data.status !== 'canceled') {
        throw new BadRequestError(
          `Campanhas ativas (entre ${formatDate(startDate)}) e ${formatDate(endDate)}) devem ter status "inProgress" ou "canceled". O status atual é "${data.status}".`,
        );
      }
    }

    const newCampaign = await this.Campaign.create(data);
    return newCampaign;
  }

  async findAll() {
    return await this.Campaign.findAll({
      attributes: [
        'id',
        'name',
        'startDate',
        'endDate',
        'status',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      order: [['status', 'ASC']],
    });
  }

  async findById(id, transaction = null) {
    const campaign = await this.Campaign.findByPk(id, {
      attributes: [
        'id',
        'name',
        'startDate',
        'endDate',
        'status',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
    });

    if (!campaign) {
      throw new NotFoundError(`Campanha com ID ${id} não encontrada.`);
    }

    return campaign;
  }

  async update(id, data) {
    // validação de payload vazio
    if (Object.keys(data).length === 0) {
      throw new BadRequestError(
        'Nenhum dado de atualização válido foi fornecido.',
      );
    }

    const VALID_STATUS = ['inProgress', 'finished', 'canceled', 'pending'];

    const campaign = await this.findById(id);

    // validação temporal (usando os novos dados ou os existentes)
    const newStartDate = new Date(data.startDate || campaign.startDate);
    const newEndDate = new Date(data.endDate || campaign.endDate);

    if (newEndDate < newStartDate) {
      throw new BadRequestError(
        'A data de término não pode ser anterior à data de início após a atualização.',
      );
    }

    const finalStatus = data.status || campaign.status; // status que será usado/mantido
    const currentDate = new Date();

    if (data.status) {
      // validação de valor permitido
      if (!VALID_STATUS.includes(data.status)) {
        throw new BadRequestError(
          `O status fornecido "${data.status}" não é válido. Use um dos seguintes: ${VALID_STATUS.join(', ')}.`,
        );
      }

      // bloquear reabertura de campanha finalizada/cancelada
      const isCurrentlyClosed = ['finished', 'canceled'].includes(
        campaign.status,
      );
      const isAttemptingReopen = !['finished', 'canceled'].includes(
        data.status,
      );

      if (isCurrentlyClosed && isAttemptingReopen) {
        throw new BadRequestError(
          'Campanhas finalizadas ou canceladas não podem ser reabertas ou ter seu status alterado para "Em Andamento" ou "Pendente".',
        );
      }
    }

    // validação temporal de status (usando as novas datas e o novo status)
    if (newEndDate < currentDate) {
      // se a campanha já terminou (data de fim no passado), o status só pode ser 'finished' ou 'canceled'
      if (finalStatus !== 'finished' && finalStatus !== 'canceled') {
        throw new BadRequestError(
          `Campanhas com data de término no passado (${formatDate(newEndDate)}) devem ter status "finished" ou "canceled". Tente alterar para "finished".`,
        );
      }
    } else if (newStartDate > currentDate) {
      // se a campanha ainda não começou (data de início no futuro), o status só pode ser 'pending' ou 'canceled'
      if (finalStatus !== 'pending' && finalStatus !== 'canceled') {
        throw new BadRequestError(
          `Campanhas futuras (início em (${formatDate(newStartDate)}) devem ter status "pending" ou "canceled". Tente alterar para "pending".`,
        );
      }
    } else {
      // se a campanha está em andamento (data de início no passado/hoje e data de fim no futuro), a campanha está ativa, o status só pode ser 'inProgress' ou 'canceled'
      if (finalStatus !== 'inProgress' && finalStatus !== 'canceled') {
        throw new BadRequestError(
          `Campanhas ativas (entre $(${formatDate(newStartDate)})} e (${formatDate(newEndDate)}) devem ter status "inProgress" ou "canceled". Tente alterar para "inProgress".`,
        );
      }
    }

    // validação de unicidade do nome (se o nome for alterado)
    if (data.name && data.name !== campaign.name) {
      const nameConflict = await this.Campaign.findOne({
        where: { name: data.name },
      });

      if (nameConflict) {
        throw new BadRequestError(
          'Já existe outra campanha cadastrada com este nome.',
        );
      }
    }

    await campaign.update(data);
    return campaign;
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();
    try {
      const campaign = await this.findById(id);

      // chegagem de histórico de doações
      const hasDonations = await this.Donation.count({
        where: { campaignId: id },
        transaction,
      });

      const hasDistributions = await this.Distribution.count({
        where: { campaignId: id },
        transaction,
      });

      // bloqueio
      if (hasDonations > 0 || hasDistributions > 0) {
        throw new BadRequestError(
          'Não é possível excluir esta campanha. Ela já possui histórico de doações ou distribuições e deve ser mantida para auditoria histórica.',
        );
      }

      // se for seguro, procede com a exclusão
      await campaign.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default CampaignService;
