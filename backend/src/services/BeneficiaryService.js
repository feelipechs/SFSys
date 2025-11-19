import { BadRequestError, NotFoundError } from '../utils/api-error.js';
import { DataValidator } from '../utils/validator.js';

class BeneficiaryService {
  constructor(models) {
    if (
      !models ||
      !models.Beneficiary ||
      !models.Distribution ||
      !models.sequelize
    ) {
      throw new Error(
        'Modelos (Beneficiary, Distribution) e a instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    this.Beneficiary = models.Beneficiary;
    this.Distribution = models.Distribution;
    this.sequelize = models.sequelize;
  }

  _validateData(data) {
    if (data.responsibleCpf && !DataValidator.isValidCPF(data.responsibleCpf)) {
      throw new BadRequestError(
        'CPF inválido ou não passou na checagem algorítmica.',
      );
    }
    // adicionar validação de email etc caso necessário
  }

  async create(data) {
    // 1. Validação de campos obrigatórios
    if (
      !data.responsibleName ||
      !data.responsibleCpf ||
      !data.registrationDate ||
      !data.address ||
      !data.familyMembersCount
    ) {
      throw new BadRequestError(
        'Os campos Nome do Responsável, CPF do Responsável, Data de Cadastro, Endereço, Número de Membros da Família são obrigatórios.',
      );
    }

    // 2. CHAMADA AO VALIDADOR DE FORMATO/ALGORITMO
    this._validateData(data); // <-- Novo

    // 3. Validação de unicidade (checa se o CPF já existe no banco)
    const existingBeneficiary = await this.Beneficiary.findOne({
      where: { responsibleCpf: data.responsibleCpf },
    });

    if (existingBeneficiary) {
      throw new BadRequestError(
        'Já existe um beneficiário cadastrado com este CPF. Verifique a unicidade.',
      );
    }

    const creationData = {
      ...data,
      registrationDate: data.registrationDate || new Date(),
    };

    const newBeneficiary = await this.Beneficiary.create(creationData);
    return newBeneficiary;
  }

  async findAll() {
    return await this.Beneficiary.findAll({
      attributes: [
        'id',
        'responsibleName',
        'responsibleCpf',
        'address',
        'familyMembersCount',
        'registrationDate',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      order: [['responsibleName', 'ASC']],
    });
  }

  async findById(id, transaction = null) {
    const beneficiary = await this.Beneficiary.findByPk(id, {
      attributes: [
        'id',
        'responsibleName',
        'responsibleCpf',
        'address',
        'familyMembersCount',
        'registrationDate',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
    });

    if (!beneficiary) {
      throw new NotFoundError(`Beneficiário com ID ${id} não encontrado.`);
    }

    return beneficiary;
  }

  async update(id, data) {
    // 1. Validação de payload vazio
    if (Object.keys(data).length === 0) {
      throw new BadRequestError(
        'Nenhum dado de atualização válido foi fornecido.',
      );
    }

    const beneficiary = await this.findById(id);

    // 2. CHAMADA AO VALIDADOR DE FORMATO/ALGORITMO (se o campo estiver no payload)
    this._validateData(data); // <-- Novo

    // 3. Validação de unicidade de CPF (se o CPF estiver sendo alterado)
    if (
      data.responsibleCpf &&
      data.responsibleCpf !== beneficiary.responsibleCpf
    ) {
      const existingBeneficiary = await this.Beneficiary.findOne({
        where: { responsibleCpf: data.responsibleCpf },
      });

      if (existingBeneficiary) {
        throw new BadRequestError(
          'O novo CPF informado já está em uso por outro beneficiário.',
        );
      }
    }

    await beneficiary.update(data);
    return beneficiary;
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();
    try {
      // reusa findById (para a checagem 404)
      const beneficiary = await this.findById(id, transaction); // Passa transaction

      // checagem de histórico: o beneficiário não pode ser excluído se tiver distribuições associadas
      const hasDistributions = await this.Distribution.count({
        where: { beneficiaryId: id },
        transaction,
      });

      if (hasDistributions > 0) {
        throw new BadRequestError(
          'Não é possível excluir este beneficiário. Ele recebeu distribuições e deve ser mantido para auditoria.',
        );
      }

      // se for seguro, procede com a exclusão
      await beneficiary.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default BeneficiaryService;
