class BeneficiaryService {
  // Recebe o modelo Beneficiary no construtor
  constructor(BeneficiaryModel) {
    if (!BeneficiaryModel) {
      throw new Error(
        'O modelo Beneficiary é obrigatório para inicializar o Service.',
      );
    }

    this.Beneficiary = BeneficiaryModel;
  }

  // Método para criar um novo beneficiário
  async create(data) {
    // Validação básica
    if (!data.responsibleName || !data.address || !data.familyMembersCount) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
    }

    const creationData = {
      ...data,
      registrationDate: data.registrationDate || new Date(),
    };

    // Usa a propriedade de instância
    const newBeneficiary = await this.Beneficiary.create(creationData);
    return newBeneficiary;
  }

  // Método para buscar todos os beneficiários
  async findAll() {
    return await this.Beneficiary.findAll({
      attributes: [
        'id',
        'responsibleName',
        'address',
        'familyMembersCount',
        'registrationDate',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      order: [['responsibleName', 'ASC']],
    });
  }

  // Método para buscar um beneficiário por ID
  async findById(id) {
    const beneficiary = await this.Beneficiary.findByPk(id, {
      attributes: [
        'id',
        'responsibleName',
        'address',
        'familyMembersCount',
        'registrationDate',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
    });

    if (!beneficiary) {
      throw new Error(`Beneficiário com ID ${id} não encontrado.`);
    }

    return beneficiary;
  }

  // Método para atualizar um beneficiário
  async update(id, data) {
    // Reusa o findById
    const beneficiary = await this.findById(id);

    await beneficiary.update(data);
    return beneficiary;
  }

  // Método para deletar um beneficiário
  async destroy(id) {
    const beneficiary = await this.findById(id);

    await beneficiary.destroy();
    // Retorna true ou nada para o Controller saber que foi sucesso
    return true;
  }
}

export default BeneficiaryService;
