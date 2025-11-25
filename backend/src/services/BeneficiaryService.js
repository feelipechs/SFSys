import { BadRequestError, NotFoundError } from '../utils/errorUtils.js';
import { DataValidator } from '../utils/validator.js';

class BeneficiaryService {
  constructor(models, addressService) {
    if (
      !models ||
      !models.Beneficiary ||
      !models.Address ||
      !models.Distribution ||
      !models.sequelize
    ) {
      throw new Error(
        'Modelos (Beneficiary, Address, Distribution) e a instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    if (!addressService) {
      throw new Error(
        'AddressService é obrigatório para inicializar o BeneficiaryService.',
      );
    }

    this.Beneficiary = models.Beneficiary;
    this.Address = models.Address;
    this.Distribution = models.Distribution;
    this.sequelize = models.sequelize;
    this.addressService = addressService;
  }

  _validateData(data) {
    if (data.responsibleCpf && !DataValidator.isValidCPF(data.responsibleCpf)) {
      throw new BadRequestError(
        'CPF inválido ou não passou na checagem algorítmica.',
      );
    }

    if (
      data.familyMembersCount !== undefined &&
      data.familyMembersCount !== null
    ) {
      const count = Number(data.familyMembersCount);

      if (isNaN(count) || count < 1 || !Number.isInteger(count)) {
        throw new BadRequestError(
          'O Número de Membros da Família deve ser um número inteiro, positivo e no mínimo 1 (um).',
        );
      }
    }

    // Validação de CEP
    if (data.cep) {
      const cleanCEP = data.cep.replace(/\D/g, '');
      if (cleanCEP.length !== 8) {
        throw new BadRequestError('CEP inválido. Deve conter 8 dígitos.');
      }
    }
  }

  async _createOrFindAddress(addressData, transaction) {
    // Usa o AddressService para criar ou buscar o endereço
    const address = await this.addressService.createOrFind(addressData);
    return address;
  }

  async create(data) {
    // Validação de campos obrigatórios
    if (
      !data.responsibleName ||
      !data.responsibleCpf ||
      !data.registrationDate ||
      !data.cep ||
      !data.familyMembersCount
    ) {
      throw new BadRequestError(
        'Os campos Nome do Responsável, CPF do Responsável, Data de Cadastro, CEP e Número de Membros da Família são obrigatórios.',
      );
    }

    this._validateData(data);

    // Validação de unicidade (checa se o CPF já existe no banco)
    const existingBeneficiary = await this.Beneficiary.findOne({
      where: { responsibleCpf: data.responsibleCpf },
    });

    if (existingBeneficiary) {
      throw new BadRequestError(
        'Já existe um beneficiário cadastrado com este CPF. Verifique a unicidade.',
      );
    }

    const transaction = await this.sequelize.transaction();

    try {
      // Cria ou busca o endereço
      const address = await this._createOrFindAddress(
        {
          cep: data.cep,
          number: data.number,
          complement: data.complement,
        },
        transaction,
      );

      // Cria o beneficiário
      const creationData = {
        responsibleName: data.responsibleName,
        responsibleCpf: data.responsibleCpf,
        registrationDate: data.registrationDate || new Date(),
        addressId: address.id,
        familyMembersCount: data.familyMembersCount,
      };

      const newBeneficiary = await this.Beneficiary.create(creationData, {
        transaction,
      });

      await transaction.commit();

      // Retorna o beneficiário com o endereço incluído
      return await this.findById(newBeneficiary.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll() {
    return await this.Beneficiary.findAll({
      attributes: [
        'id',
        'responsibleName',
        'responsibleCpf',
        'familyMembersCount',
        'registrationDate',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      include: [
        {
          model: this.sequelize.models.Address,
          as: 'address',
          attributes: [
            'id',
            'cep',
            'state',
            'city',
            'neighborhood',
            'street',
            'number',
            'complement',
            'latitude',
            'longitude',
          ],
        },
      ],
      order: [['responsibleName', 'ASC']],
    });
  }

  async findById(id) {
    const beneficiary = await this.Beneficiary.findByPk(id, {
      attributes: [
        'id',
        'responsibleName',
        'responsibleCpf',
        'familyMembersCount',
        'registrationDate',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      include: [
        {
          model: this.Address,
          as: 'address',
          attributes: [
            'id',
            'cep',
            'state',
            'city',
            'neighborhood',
            'street',
            'number',
            'complement',
            'latitude',
            'longitude',
          ],
        },
      ],
    });

    if (!beneficiary) {
      throw new NotFoundError(`Beneficiário com ID ${id} não encontrado.`);
    }

    return beneficiary;
  }

  async update(id, data) {
    // Validação de payload vazio
    if (Object.keys(data).length === 0) {
      throw new BadRequestError(
        'Nenhum dado de atualização válido foi fornecido.',
      );
    }

    const beneficiary = await this.findById(id);

    this._validateData(data);

    // Validação de unicidade de CPF (se o CPF estiver sendo alterado)
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

    const transaction = await this.sequelize.transaction();

    try {
      // Se houver mudança de endereço (CEP, número ou complemento)
      if (
        data.cep ||
        data.number !== undefined ||
        data.complement !== undefined
      ) {
        const addressData = {
          cep: data.cep || beneficiary.address.cep,
          number:
            data.number !== undefined
              ? data.number
              : beneficiary.address.number,
          complement:
            data.complement !== undefined
              ? data.complement
              : beneficiary.address.complement,
        };

        const newAddress = await this._createOrFindAddress(
          addressData,
          transaction,
        );

        // Atualiza o addressId do beneficiário
        data.addressId = newAddress.id;
      }

      // Remove campos de endereço do objeto data antes de atualizar o beneficiário
      const { cep, number, complement, ...beneficiaryData } = data;

      await beneficiary.update(beneficiaryData, { transaction });

      await transaction.commit();

      return await this.findById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();
    try {
      // Reusa findById (para a checagem 404)
      const beneficiary = await this.findById(id);

      // Checagem de histórico: o beneficiário não pode ser excluído se tiver distribuições associadas
      const hasDistributions = await this.Distribution.count({
        where: { beneficiaryId: id },
        transaction,
      });

      if (hasDistributions > 0) {
        throw new BadRequestError(
          'Não é possível excluir este beneficiário. Ele recebeu distribuições e deve ser mantido para auditoria.',
        );
      }

      // Se for seguro, procede com a exclusão
      await this.Beneficiary.destroy({
        where: { id },
        transaction,
      });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default BeneficiaryService;
