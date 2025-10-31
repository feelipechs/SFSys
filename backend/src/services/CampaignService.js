import db from '../database';

const { Campaign } = db;

class CampaignService {
  static async create(data) {
    if (!data.name || !data.startDate || !data.endDate) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
    }

    const newCampaign = await Campaign.create(data);
    return newCampaign;
  }

  static async findAll() {
    return await Campaign.findAll({
      attributes: [
        'id',
        'name',
        ['start_date', 'startDate'],
        ['end_date', 'endDate'],
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      order: [['name', 'ASC']],
    });
  }

  static async findById(id) {
    const campaign = await Campaign.findByPk(id, {
      attributes: [
        'id',
        'name',
        ['start_date', 'startDate'],
        ['end_date', 'endDate'],
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
    });

    if (!campaign) {
      throw new Error(`Campanha com ID ${id} não encontrada.`);
    }
    return campaign;
  }

  static async update(id, data) {
    const campaign = await this.findById(id);

    await campaign.update(data);
    return campaign;
  }

  static async destroy(id) {
    const campaign = await this.findById(id);

    await campaign.destroy();
    return { message: `Campanha com ID ${id} excluída com sucesso.` };
  }
}

export default CampaignService;
