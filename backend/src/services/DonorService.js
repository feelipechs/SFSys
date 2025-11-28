import { BadRequestError, NotFoundError } from '../utils/errorUtils.js';
import { DonorSpecification } from '../specifications/DonorSpecification.js';

class DonorService {
  constructor(models) {
    if (!models || !models.Donor || !models.Donation || !models.sequelize) {
      throw new Error(
        'Modelos (Donor) e instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    this.Donor = models.Donor;
    this.DonorIndividual = models.DonorIndividual;
    this.DonorLegal = models.DonorLegal;
    this.Donation = models.Donation;
    this.sequelize = models.sequelize;
    this.Op = this.sequelize.constructor.Op;
    this.specification = new DonorSpecification(models);
  }

  // método auxiliar para isolar a lógica de herança e checagem de campos obrigatórios, lida com o IF/ELSE de 'individual' vs 'legal'
  _getChildDetails(type, data) {
    if (type === 'individual') {
      const individualData = data.individual;
      if (
        !individualData ||
        !individualData.cpf ||
        !individualData.dateOfBirth
      ) {
        throw new BadRequestError('CPF e Data de Nascimento são obrigatórios.');
      }
      return {
        ChildModel: this.DonorIndividual,
        nestedData: individualData,
        uniqueField: 'cpf',
      };
    }

    if (type === 'legal') {
      const legalData = data.legal;
      if (!legalData || !legalData.cnpj || !legalData.tradeName) {
        throw new BadRequestError('CNPJ e Razão Social são obrigatórios.');
      }
      return {
        ChildModel: this.DonorLegal,
        nestedData: legalData,
        uniqueField: 'cnpj',
      };
    }

    throw new BadRequestError(
      `O tipo de doador '${type}' é inválido. Use 'individual' ou 'legal'.`,
    );
  }

  async create(data) {
    const { type, individual, legal, ...donorBaseData } = data;
    const transaction = await this.sequelize.transaction();

    try {
      // lógica de herança (checa obrigatoriedade e define Model)
      const { ChildModel, nestedData, uniqueField } = this._getChildDetails(
        type,
        data,
      );

      // checagem de unicidade no db (specification)
      // checa CPF/CNPJ
      await this.specification.checkDocumentUniqueness(
        type,
        nestedData[uniqueField],
        null, // donorId = null para criação
      );

      // checa email/telefone na tabela base
      await this.specification.checkEmailPhoneUniqueness(donorBaseData, null);

      // criação transacional
      const donorDataToSave = { ...donorBaseData, type };
      const newDonor = await this.Donor.create(donorDataToSave, {
        transaction,
      });

      const childDataToSave = { ...nestedData, donorId: newDonor.id };
      await ChildModel.create(childDataToSave, { transaction });

      await transaction.commit();
      return this.findById(newDonor.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

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
      include: [
        { association: 'individual', attributes: { exclude: ['donor_id'] } },
        { association: 'legal', attributes: { exclude: ['donor_id'] } },
      ],
      order: [['name', 'ASC']],
    });
  }

  async findById(id, transaction = null) {
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
      include: [{ association: 'individual' }, { association: 'legal' }],
    });

    if (!donor) {
      throw new NotFoundError(`Doador com ID ${id} não encontrado.`);
    }

    return donor;
  }

  async update(id, data) {
    const transaction = await this.sequelize.transaction();
    try {
      const donor = await this.findById(id, transaction);

      if (Object.keys(data).length === 0) {
        throw new BadRequestError(
          'Nenhum dado de atualização válido foi fornecido.',
        );
      }

      const { individual, legal, ...donorBaseData } = data;

      await this.specification.checkEmailPhoneUniqueness(donorBaseData, id);

      if (individual || legal) {
        const type = donor.type;
        const currentData =
          type === 'individual'
            ? donor.individual.dataValues
            : donor.legal.dataValues;
        const payload = type === 'individual' ? individual : legal;

        // mescla dados atuais com o payload para checar a validade completa
        const mergedData = {
          ...currentData,
          ...(payload || {}),
        };

        // define o payload com base na herança
        const dataForChildDetails =
          type === 'individual'
            ? { individual: mergedData }
            : { legal: mergedData };

        // usa a lógica de detalhes para checar os campos obrigatórios pós-merge
        const {
          ChildModel,
          nestedData: finalNestedData,
          uniqueField,
        } = this._getChildDetails(type, dataForChildDetails);

        // checa unicidade do documento do filho (CPF/CNPJ), excluindo o id atual
        await this.specification.checkDocumentUniqueness(
          type,
          finalNestedData[uniqueField],
          id,
        );

        // persistência na tabela tilha
        await ChildModel.update(finalNestedData, {
          where: { donorId: id },
          transaction,
        });
      }

      // persistência na tabela base (Donor)
      if (Object.keys(donorBaseData).length > 0) {
        await donor.update(donorBaseData, { transaction });
      }

      await transaction.commit();
      return this.findById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();
    try {
      const donor = await this.findById(id, transaction);

      // checagem de histórico de doações
      const hasDonations = await this.Donation.count({
        where: { donorId: id },
        transaction,
      });

      if (hasDonations > 0) {
        throw new BadRequestError(
          'Não é possível excluir este doador. Ele possui doações registradas e deve ser mantido para auditoria.',
        );
      }

      await donor.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default DonorService;
