import db from '../database/index.js';

// Desestruturamos o Model Beneficiary para uso direto
const { Beneficiary } = db;

class BeneficiaryService {
  // Método para criar um novo beneficiário
  static async create(data) {
    // Validação básica
    if (!data.responsibleName || !data.address || !data.familyMembersCount) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
    }

    // Se registrationDate não for fornecida, usa a data/hora atual (simplifica a inserção)
    const creationData = {
      ...data,
      registrationDate: data.registrationDate || new Date(),
    };

    const newBeneficiary = await Beneficiary.create(creationData);
    return newBeneficiary;
  }

  // Método para buscar todos os beneficiários
  static async findAll() {
    return await Beneficiary.findAll({
      // ✅ CORREÇÃO AQUI: Força o Sequelize a buscar 'created_at' e renomear para 'createdAt'
      attributes: [
        'id',
        'responsibleName',
        'address',
        'familyMembersCount',
        'registrationDate',
        ['created_at', 'createdAt'], // Corrigido
        ['updated_at', 'updatedAt'], // Incluído por boa prática
      ],
      order: [['responsibleName', 'ASC']],
    });
  }

  // Método para buscar um beneficiário por ID
  static async findById(id) {
    const beneficiary = await Beneficiary.findByPk(id, {
      // ✅ CORREÇÃO AQUI: Mapeamento explícito para timestamps
      attributes: [
        'id',
        'responsibleName',
        'address',
        'familyMembersCount',
        'registrationDate',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      // Se precisar incluir as distribuições:
      // include: [{ model: db.Distribution, as: 'distributions' }]
    });

    if (!beneficiary) {
      throw new Error(`Beneficiário com ID ${id} não encontrado.`);
    }
    return beneficiary;
  }

  // Método para atualizar um beneficiário
  static async update(id, data) {
    const beneficiary = await this.findById(id); // Reusa o findById para checar se existe

    await beneficiary.update(data);
    return beneficiary;
  }

  // Método para deletar um beneficiário
  static async destroy(id) {
    const beneficiary = await this.findById(id); // Reusa o findById para checar se existe

    await beneficiary.destroy();
    return { message: `Beneficiário com ID ${id} excluído com sucesso.` };
  }
}

export default BeneficiaryService;
