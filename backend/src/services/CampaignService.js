class CampaignService {
  constructor(CampaignModel) {
    if (!CampaignModel) {
      throw new Error(
        'O modelo Campaign é obrigatório para inicializar o Service.',
      );
    }

    this.Campaign = CampaignModel;
  }

  async create(data) {
    if (!data.name || !data.startDate || !data.endDate) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
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
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      order: [['name', 'ASC']],
    });
  }

  async findById(id) {
    const campaign = await this.Campaign.findByPk(id, {
      attributes: [
        'id',
        'name',
        'startDate',
        'endDate',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
    });

    if (!campaign) {
      throw new Error(`Campanha com ID ${id} não encontrada.`);
    }

    return campaign;
  }

  async update(id, data) {
    const campaign = await this.findById(id);

    await campaign.update(data);
    return campaign;
  }

  async destroy(id) {
    const campaign = await this.findById(id);

    await campaign.destroy();
    return true;
  }
}

export default CampaignService;
