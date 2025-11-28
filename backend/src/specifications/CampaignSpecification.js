import { BadRequestError } from '../utils/errorUtils.js';

export class CampaignSpecification {
  constructor(models) {
    this.Campaign = models.Campaign;
    this.Donation = models.Donation;
    this.Distribution = models.Distribution;
    this.Op = models.sequelize.constructor.Op;
  }

  async checkNameUniqueness(name, campaignId = null) {
    const whereClause = { name: name };

    // exclui a própria campanha no caso de um update
    if (campaignId) {
      whereClause.id = { [this.Op.not]: campaignId };
    }

    const existing = await this.Campaign.findOne({ where: whereClause });

    if (existing) {
      throw new BadRequestError(
        'Já existe outra campanha cadastrada com este nome.',
      );
    }
  }

  async checkAuditHistory(campaignId, transaction) {
    const hasDonations = await this.Donation.count({
      where: { campaignId },
      transaction,
    });

    const hasDistributions = await this.Distribution.count({
      where: { campaignId },
      transaction,
    });

    if (hasDonations > 0 || hasDistributions > 0) {
      throw new BadRequestError(
        'Não é possível excluir esta campanha. Ela já possui histórico de doações ou distribuições e deve ser mantida para auditoria.',
      );
    }
  }
}
