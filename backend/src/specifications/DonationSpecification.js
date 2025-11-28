import { BadRequestError, NotFoundError } from '../utils/errorUtils.js';

export class DonationSpecification {
  constructor(models) {
    this.Campaign = models.Campaign;
  }

  async checkCampaignStatusForDonation(campaignId) {
    if (!campaignId) return;

    const campaign = await this.Campaign.findByPk(campaignId);

    if (!campaign) {
      throw new NotFoundError(`Campanha com ID ${campaignId} não encontrada.`);
    }

    if (campaign.status !== 'inProgress') {
      throw new BadRequestError(
        `Não é possível associar a doação à campanha "${campaign.name}". O status atual é "${campaign.status}".`,
      );
    }
  }
}
