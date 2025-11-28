import { BadRequestError, NotFoundError } from '../utils/errorUtils.js';
import { BeneficiarySpecification } from '../specifications/BeneficiarySpecification.js';

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
    this.specification = new BeneficiarySpecification(models);
  }

  async _createOrFindAddress(addressData, transaction) {
    // usa o AddressService para criar ou buscar o endereço
    const address = await this.addressService.createOrFind(
      addressData,
      transaction,
    );
    return address;
  }

  async create(data) {
    await this.specification.checkCpfUniqueness(data.responsibleCpf);

    const transaction = await this.sequelize.transaction();

    try {
      // cria ou busca o endereço (AddressService)
      const address = await this._createOrFindAddress(
        {
          cep: data.cep,
          number: data.number,
          complement: data.complement,
        },
        transaction,
      );

      // cria o beneficiário
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

      // retorna o beneficiário com o endereço incluído
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
    // validação de payload vazio
    if (Object.keys(data).length === 0) {
      throw new BadRequestError(
        'Nenhum dado de atualização válido foi fornecido.',
      );
    }

    const beneficiary = await this.findById(id);

    if (
      data.responsibleCpf &&
      data.responsibleCpf !== beneficiary.responsibleCpf
    ) {
      await this.specification.checkCpfUniqueness(data.responsibleCpf, id);
    }

    const transaction = await this.sequelize.transaction();

    try {
      const hasAddressFieldsInPayload =
        data.cep || data.number !== undefined || data.complement !== undefined;

      if (hasAddressFieldsInPayload) {
        // mescla o endereço atual com o payload. O valor atual serve como fallback
        const addressDataPayload = {
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
          addressDataPayload,
          transaction,
        );

        // atualiza o addressId do beneficiário
        data.addressId = newAddress.id;
      }

      // remove campos de endereço (cep, number, complement) do objeto data antes de atualizar o beneficiário
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
      // reusa findById (para a checagem 404)
      await this.findById(id);

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
