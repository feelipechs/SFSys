class DonorService {
  // Construtor que recebe todos os modelos e a instância do Sequelize.
  constructor(models) {
    if (!models || !models.Donor || (!models.connection && !models.sequelize)) {
      throw new Error(
        'Modelos (Donor) e instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    this.Donor = models.Donor;
    this.DonorIndividual = models.DonorIndividual;
    this.DonorLegal = models.DonorLegal;
    this.sequelize = models.connection;
  }

  // 1. CREATE (Método Corrigido: Sequencial e com Campo 'type' Incluso)
  async create(data) {
    // 1. Desestruturar 'type' e os dados aninhados.
    // Usamos 'donorBaseData' para os campos que vão para a tabela 'donor'.
    const { type, individual, legal, ...donorBaseData } = data;
    const transaction = await this.sequelize.transaction(); // Inicia a transação

    try {
      let nestedData;

      // Validar e preparar os dados aninhados
      if (type === 'individual' && individual) {
        nestedData = individual;
      } else if (type === 'legal' && legal) {
        nestedData = legal;
      } else {
        // Se 'type' for válido, mas faltarem os dados aninhados
        throw new Error(
          `Dados de herança inválidos ou faltando para o tipo: ${type}.`,
        );
      }

      // 2. CRIAR O PAI (Donor) PRIMEIRO.
      const donorDataToSave = { ...donorBaseData, type };

      const newDonor = await this.Donor.create(donorDataToSave, {
        transaction,
      });

      // 3. MONTAR O OBJETO DO FILHO, INJETANDO O ID DO PAI.
      const dataToCreate = {
        ...nestedData,
        // Injeta o ID gerado pelo banco.
        // Usamos 'donorId' (camelCase) para garantir a correspondência no DB.
        donorId: newDonor.id,
      };

      // 4. CRIAR O FILHO SEPARADAMENTE (Injeção garantida).
      if (type === 'individual') {
        await this.DonorIndividual.create(dataToCreate, { transaction });
      } else if (type === 'legal') {
        await this.DonorLegal.create(dataToCreate, { transaction });
      }

      // 5. Commit e Retorno
      await transaction.commit();

      // Retornamos o objeto completo (buscando-o novamente com os includes)
      return this.findById(newDonor.id);
    } catch (error) {
      // Se algo falhar, revertemos todas as alterações.
      await transaction.rollback();
      throw error;
    }
  }

  // 2. READ (Lida com Herança - precisa do include)

  // Busca todos os Doadores, incluindo seus detalhes de herança.
  async findAll() {
    return this.Donor.findAll({
      attributes: [
        'id',
        'type',
        'name',
        'phone',
        'email',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      // Inclui ambos os lados para trazer todos os detalhes de todos os doadores.
      include: [{ association: 'individual' }, { association: 'legal' }],
      order: [['name', 'ASC']],
    });
  }

  // Busca um Doador por ID, incluindo ambas as associações de herança.
  async findById(id) {
    const donor = await this.Donor.findByPk(id, {
      attributes: [
        'id',
        'type',
        'name',
        'phone',
        'email',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      // Inclui ambos os lados da herança para garantir que o tipo correto seja retornado.
      include: [{ association: 'individual' }, { association: 'legal' }],
    });

    if (!donor) {
      throw new Error(`Doador com ID ${id} não encontrado.`);
    }

    return donor;
  }

  // 3. UPDATE (Focado na Tabela Base)
  // Atualiza os campos do Doador na tabela base.
  async update(id, data) {
    const donor = await this.findById(id);

    // Ignora dados de sub-tabelas para atualização simples da tabela base.
    const { individual, legal, ...donorBaseData } = data;

    await donor.update(donorBaseData);

    // Retorna a instância completa e atualizada
    return this.findById(id);
  }

  // 4. DELETE (Depende do 'CASCADE' nos modelos)
  // Exclui um Doador por ID.
  async destroy(id) {
    const donor = await this.findById(id);

    // O onDelete: 'CASCADE' na associação garante que a sub-tabela também seja excluída.
    await donor.destroy();

    return true;
  }
}

export default DonorService;
