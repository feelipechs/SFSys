class DistributionService {
  constructor(DistributionModel) {
    if (!DistributionModel) {
      throw new Error(
        'O modelo Distribution é obrigatório para inicializar o Service.',
      );
    }

    this.Distribution = DistributionModel;
  }

  async create(data) {
    if (!data.dateTime || !data.quantityBaskets || !data.beneficiaryId) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
    }

    const newDistribution = await this.Distribution.create(data);
    return newDistribution;
  }

  async findAll() {
    return await this.Distribution.findAll({
      attributes: [
        'id',
        'dateTime',
        'quantityBaskets',
        'observation',
        'beneficiaryId',
        'deliveryUserId',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      order: [['dateTime', 'DESC']],
    });
  }

  async findById(id) {
    const distribution = await this.Distribution.findByPk(id, {
      attributes: [
        'id',
        'dateTime',
        'quantityBaskets',
        'observation',
        'beneficiaryId',
        'deliveryUserId',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
    });

    if (!distribution) {
      throw new Error(`Distribuição com ID ${id} não encontrado.`);
    }

    return distribution;
  }

  async update(id, data) {
    const distribution = await this.findById(id);

    await distribution.update(data);
    return distribution;
  }

  async destroy(id) {
    const distribution = await this.findById(id);

    await distribution.destroy();
    return true;
  }
}

export default DistributionService;
