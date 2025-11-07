import { BadRequestError, NotFoundError } from '../utils/api-error.js';
import { DataValidator } from '../utils/validator.js';

class DonorService {
  // construtor que recebe todos os modelos e a instância do sequelize
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
    this.Op = models.sequelize.Op; // operadores do sequelize
  }

  _validateFormatsAndDocuments(data) {
    // validação de formato (pode estar na base ou nas sub-tabelas)
    if (data.email && !DataValidator.isValidEmail(data.email)) {
      throw new BadRequestError('Formato de e-mail inválido.');
    }
    if (data.phone && !DataValidator.isValidPhone(data.phone)) {
      throw new BadRequestError(
        'Formato de telefone inválido. Use o padrão brasileiro.',
      );
    }

    // validação de CPF (pessoa física)
    if (data.type === 'individual' && data.individual && data.individual.cpf) {
      if (!DataValidator.isValidCPF(data.individual.cpf)) {
        throw new BadRequestError(
          'CPF inválido ou não passou na checagem algorítmica.',
        );
      }
    }

    // validação de CNPJ (pessoa jurídica)
    if (data.type === 'legal' && data.legal && data.legal.cnpj) {
      if (!DataValidator.isValidCNPJ(data.legal.cnpj)) {
        throw new BadRequestError(
          'CNPJ inválido ou não passou na checagem algorítmica.',
        );
      }
    }
  }

  // create
  async create(data) {
    const { type, individual, legal, ...donorBaseData } = data;
    const transaction = await this.sequelize.transaction();

    try {
      // validação de campos obrigatórios
      if (!donorBaseData.name || !type) {
        // phone/email podem não ser obrigatórios na Model
        throw new BadRequestError('Os campos nome e tipo são obrigatórios.');
      }

      // validação de formato e documento (usando o validator)
      this._validateFormatsAndDocuments(data);

      let nestedData;
      let ChildModel;
      let uniqueField;

      if (type === 'individual') {
        if (!individual || !individual.cpf)
          throw new BadRequestError('CPF e dados de Pessoa Física faltando.');
        ChildModel = this.DonorIndividual;
        nestedData = individual;
        uniqueField = 'cpf';
      } else if (type === 'legal') {
        if (!legal || !legal.cnpj)
          throw new BadRequestError(
            'CNPJ e dados de Pessoa Jurídica faltando.',
          );
        ChildModel = this.DonorLegal;
        nestedData = legal;
        uniqueField = 'cnpj';
      } else {
        throw new BadRequestError(
          `O tipo de doador '${type}' é inválido. Use 'individual' ou 'legal'.`,
        );
      }

      // validação de unicidade no db (CPF/CNPJ)
      const existing = await ChildModel.findOne({
        where: { [uniqueField]: nestedData[uniqueField] },
      });
      if (existing) {
        throw new BadRequestError(
          `${uniqueField.toUpperCase()} já cadastrado para outro doador.`,
        );
      }

      // criação transacional (pai e filho)
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

  // read (lida com herança - precisa do include)
  // busca todos os doadores, incluindo seus detalhes de herança
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
      // inclui ambos os lados para trazer todos os detalhes de todos os doadores.
      include: [{ association: 'individual' }, { association: 'legal' }],
      order: [['name', 'ASC']],
    });
  }

  // busca um doador por id, incluindo ambas as associações de herança
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
      // inclui ambos os lados da herança para garantir que o tipo correto seja retornado
      include: [{ association: 'individual' }, { association: 'legal' }],
    });

    if (!donor) {
      throw new NotFoundError(`Doador com ID ${id} não encontrado.`);
    }

    return donor;
  }

  // update (focado na tabela base)
  // atualiza os campos do doador na tabela base
  async update(id, data) {
    const transaction = await this.sequelize.transaction();
    try {
      const donor = await this.findById(id, transaction); // Lê o doador atual

      if (Object.keys(data).length === 0) {
        throw new BadRequestError(
          'Nenhum dado de atualização válido foi fornecido.',
        );
      }

      // validação de formato e documento
      this._validateFormatsAndDocuments({ ...data, type: donor.type }); // passa o type para saber qual doc checar

      // separa dados da base e da herança
      const { individual, legal, ...donorBaseData } = data;

      // atualização da tabela base (Donor)
      if (Object.keys(donorBaseData).length > 0) {
        await donor.update(donorBaseData, { transaction });
      }

      // atualização das tabelas filhas (se houver payload)
      let childPayload = donor.type === 'individual' ? individual : legal;
      let ChildModel =
        donor.type === 'individual' ? this.DonorIndividual : this.DonorLegal;
      let uniqueField = donor.type === 'individual' ? 'cpf' : 'cnpj';

      if (childPayload) {
        const documentValue = childPayload[uniqueField];

        if (documentValue) {
          // checa unicidade: o novo documento não pode ser de outro doador
          const existing = await ChildModel.findOne({
            where: {
              [uniqueField]: documentValue,
              donorId: { [this.Op.not]: id }, // Op.not (diferente do id atual)
            },
            transaction,
          });

          if (existing) {
            throw new BadRequestError(
              `O novo ${uniqueField.toUpperCase()} já está em uso por outro cadastro.`,
            );
          }

          // realiza o update na tabela filha
          await ChildModel.update(childPayload, {
            where: { donorId: id },
            transaction,
          });
        }
      }

      await transaction.commit();
      return this.findById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // delete (depende do 'CASCADE' nos modelos)
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

      // se o onDelete: 'CASCADE' estiver configurado no sequelize, a destruição do pai também remove os filhos (individual ou legal)
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
