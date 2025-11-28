import { BadRequestError, NotFoundError } from '../utils/errorUtils.js';
import { CampaignSpecification } from '../specifications/CampaignSpecification.js';

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
    this.specification = new CampaignSpecification(models);
  }

  _validateStatusAgainstTimeline(startDate, endDate, status) {
    const currentDate = new Date();

    if (endDate < currentDate) {
      // campanha encerrada: data de fim no passado
      if (status !== 'finished' && status !== 'canceled') {
        throw new BadRequestError(
          `Campanhas com data de término no passado (${formatDate(endDate)}) devem ter status "finished" ou "canceled". O status atual é "${status}".`,
        );
      }
    } else if (startDate > currentDate) {
      // campanha futura: data de início no futuro
      if (status !== 'pending' && status !== 'canceled') {
        throw new BadRequestError(
          `Campanhas futuras (início em ${formatDate(startDate)}) devem ter status "pending" ou "canceled". O status atual é "${status}".`,
        );
      }
    } else {
      // campanha ativa: em andamento
      if (status !== 'inProgress' && status !== 'canceled') {
        throw new BadRequestError(
          `Campanhas ativas (entre ${formatDate(startDate)} e ${formatDate(endDate)}) devem ter status "inProgress" ou "canceled". O status atual é "${status}".`,
        );
      }
    }
  }

  async create(data) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    await this.specification.checkNameUniqueness(data.name);

    this._validateStatusAgainstTimeline(startDate, endDate, data.status);

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
        'category',
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
        'category',
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
    const campaign = await this.findById(id);

    const newStartDate = new Date(data.startDate || campaign.startDate);
    const newEndDate = new Date(data.endDate || campaign.endDate);
    const finalStatus = data.status || campaign.status;

    const isCurrentlyClosed = ['finished', 'canceled'].includes(
      campaign.status,
    );
    const isAttemptingReopen =
      data.status && !['finished', 'canceled'].includes(data.status);

    if (isCurrentlyClosed && isAttemptingReopen) {
      throw new BadRequestError(
        'Campanhas finalizadas ou canceladas não podem ser reabertas ou ter seu status alterado para "Em Andamento" ou "Pendente".',
      );
    }

    if (data.name && data.name !== campaign.name) {
      await this.specification.checkNameUniqueness(data.name, id);
    }

    this._validateStatusAgainstTimeline(newStartDate, newEndDate, finalStatus);

    await campaign.update(data);
    return campaign;
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.findById(id);

      await this.specification.checkAuditHistory(id, transaction);

      await this.Campaign.destroy({
        where: { id },
        transaction,
      });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default CampaignService;
