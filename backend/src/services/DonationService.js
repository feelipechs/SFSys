class DonationService {
  constructor(DonationModel) {
    if (!DonationModel) {
      throw new Error(
        'O modelo Donation é obrigatório para inicializar o Service.',
      );
    }

    this.Donation = DonationModel;
  }

  async create(data) {
    if (!data.dateTime || !data.donorId) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
    }

    // incluir o responsibleUserId e campaignId
    // na validação se eles também forem NOT NULL no DB (mesmo que allowNull: true no modelo).

    const newDonation = await this.Donation.create(data);
    return newDonation;
  }

  async findAll() {
    return await this.Donation.findAll({
      attributes: [
        'id',
        'dateTime',
        'observation',
        'donorId',
        'responsibleUserId',
        'campaignId',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      order: [['dateTime', 'DESC']],
    });
  }

  async findById(id) {
    const donation = await this.Donation.findByPk(id, {
      attributes: [
        'id',
        'dateTime',
        'observation',
        'donorId',
        'responsibleUserId',
        'campaignId',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
    });

    if (!donation) {
      throw new Error(`Doação com ID ${id} não encontrado.`);
    }

    return donation;
  }

  async update(id, data) {
    const donation = await this.findById(id);

    await donation.update(data);
    return donation;
  }

  async destroy(id) {
    const donation = await this.findById(id);

    await donation.destroy();
    return true;
  }
}

export default DonationService;
