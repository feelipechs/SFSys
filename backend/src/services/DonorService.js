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
    // this.Op = models.sequelize.Op; // operadores do sequelize
    this.Op = this.sequelize.constructor.Op; // operadores do sequelize
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

  _validateMinimumAge(birthDateString, minAge = 14) {
    if (!birthDateString) return; // se a data for opcional (mas aqui será obrigatória)

    const today = new Date();
    const birthDate = new Date(birthDateString);

    // calcula a data de 14 anos atrás a partir da data de nascimento
    const dateMinAge = new Date(birthDate);
    dateMinAge.setFullYear(birthDate.getFullYear() + minAge);

    // se a data que a pessoa completa a idade mínima ainda não chegou (ou seja, está no futuro), a pessoa é muito jovem
    if (today < dateMinAge) {
      // calcula a idade atual para a mensagem de erro (opcional, mas útil)
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      throw new BadRequestError(
        `O Doador PF deve ter no mínimo ${minAge} anos. Idade calculada: ${age} anos.`,
      );
    }
  }

  // create
  async create(data) {
    const { type, individual, legal, ...donorBaseData } = data;
    const transaction = await this.sequelize.transaction();

    try {
      // validação de campos obrigatórios
      if (!donorBaseData.name || !donorBaseData.email || !type) {
        // phone/email podem não ser obrigatórios na Model
        throw new BadRequestError(
          'Os campos nome, email e tipo são obrigatórios.',
        );
      }

      // validação de formato e documento (usando o validator)
      this._validateFormatsAndDocuments(data);
      this._validateMinimumAge(individual.dateOfBirth);

      let nestedData;
      let ChildModel;
      let uniqueField;

      if (type === 'individual') {
        if (!individual || !individual.cpf || !individual.dateOfBirth)
          throw new BadRequestError(
            'CPF e Data de Nascimento são obrigatórios.',
          );
        ChildModel = this.DonorIndividual;
        nestedData = individual;
        uniqueField = 'cpf';
      } else if (type === 'legal') {
        if (!legal || !legal.cnpj || !legal.tradeName)
          throw new BadRequestError('CNPJ e Razão Social são obrigatórios.');
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

      const emailCheck = donorBaseData.email
        ? { email: donorBaseData.email }
        : {};
      const phoneCheck = donorBaseData.phone
        ? { phone: donorBaseData.phone }
        : {};

      const uniqueChecks = [];
      if (Object.keys(emailCheck).length > 0) uniqueChecks.push(emailCheck);
      if (Object.keys(phoneCheck).length > 0) uniqueChecks.push(phoneCheck);

      if (uniqueChecks.length > 0) {
        const existingDonor = await this.Donor.findOne({
          where: {
            [this.Op.or]: uniqueChecks,
          },
          attributes: ['email', 'phone'],
          // não é necessário passar 'transaction' pois é apenas uma leitura
        });

        if (existingDonor) {
          let message = '';
          if (existingDonor.email === donorBaseData.email) {
            message = 'E-mail já cadastrado.';
          } else if (existingDonor.phone === donorBaseData.phone) {
            // usa 'else if' para priorizar a mensagem mais relevante, ou pode lançar dois erros em uma lista
            message = 'Telefone já cadastrado.';
          }

          throw new BadRequestError(message);
        }
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
      include: [
        { association: 'individual', attributes: { exclude: ['donor_id'] } },
        { association: 'legal', attributes: { exclude: ['donor_id'] } },
      ],
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
      // lê o doador atual (incluindo individual/legal para checagens)
      const donor = await this.findById(id, transaction);

      if (Object.keys(data).length === 0) {
        throw new BadRequestError(
          'Nenhum dado de atualização válido foi fornecido.',
        );
      }

      // validação de formato e documento (para campos que estão sendo atualizados)
      this._validateFormatsAndDocuments({ ...data, type: donor.type });

      // separa dados da base e da herança
      const { individual, legal, ...donorBaseData } = data;

      // checagem de unicidade para email/phone na tabela base
      const emailUpdated =
        donorBaseData.email && donorBaseData.email !== donor.email;
      const phoneUpdated =
        donorBaseData.phone && donorBaseData.phone !== donor.phone;

      if (emailUpdated || phoneUpdated) {
        const uniqueChecks = [];
        if (emailUpdated) uniqueChecks.push({ email: donorBaseData.email });
        if (phoneUpdated) uniqueChecks.push({ phone: donorBaseData.phone });

        if (uniqueChecks.length > 0) {
          const existingDonor = await this.Donor.findOne({
            where: {
              [this.Op.or]: uniqueChecks,
              // exclui o id do doador atual da pesquisa
              id: { [this.Op.not]: id },
            },
            attributes: ['id', 'email', 'phone'],
            transaction,
          });

          if (existingDonor) {
            let message = 'O dado fornecido já está em uso por outro cadastro:';
            if (existingDonor.email === donorBaseData.email) {
              message = 'O novo E-mail já está em uso por outro cadastro.';
            } else if (existingDonor.phone === donorBaseData.phone) {
              message = 'O novo Telefone já está em uso por outro cadastro.';
            }

            throw new BadRequestError(message);
          }
        }
      }

      // atualização da tabela base (Donor)
      if (Object.keys(donorBaseData).length > 0) {
        await donor.update(donorBaseData, { transaction });
      }

      // configuração para atualização das tabelas filhas
      let childPayload = donor.type === 'individual' ? individual : legal;
      let ChildModel =
        donor.type === 'individual' ? this.DonorIndividual : this.DonorLegal;
      let uniqueField = donor.type === 'individual' ? 'cpf' : 'cnpj';

      if (childPayload) {
        // checagem de campos obrigatórios da sub-tabela
        if (donor.type === 'individual') {
          const currentIndividual = donor.individual.dataValues;

          // prioriza o valor do payload, senão usa o valor atual do banco
          const hasCpf =
            childPayload.cpf !== undefined
              ? childPayload.cpf
              : currentIndividual.cpf;
          const hasDateOfBirth =
            childPayload.dateOfBirth !== undefined
              ? childPayload.dateOfBirth
              : currentIndividual.dateOfBirth;

          if (!hasCpf || !hasDateOfBirth) {
            throw new BadRequestError(
              'CPF e Data de Nascimento são obrigatórios.',
            );
          }

          // validação de idade
          const finalDateOfBirth =
            childPayload.dateOfBirth !== undefined
              ? childPayload.dateOfBirth
              : currentIndividual.dateOfBirth;

          this._validateMinimumAge(finalDateOfBirth);
        } else if (donor.type === 'legal') {
          const currentLegal = donor.legal.dataValues;

          // prioriza o valor do payload, senão usa o valor atual do banco
          const hasCnpj =
            childPayload.cnpj !== undefined
              ? childPayload.cnpj
              : currentLegal.cnpj;
          const hasTradeName =
            childPayload.tradeName !== undefined
              ? childPayload.tradeName
              : currentLegal.tradeName;

          if (!hasCnpj || !hasTradeName) {
            throw new BadRequestError('CNPJ e Razão Social são obrigatórios.');
          }
        }

        const documentValue = childPayload[uniqueField];

        if (documentValue) {
          // checa unicidade: o novo documento não pode ser de outro doador
          const existing = await ChildModel.findOne({
            where: {
              [uniqueField]: documentValue,
              donorId: { [this.Op.not]: id }, // diferente do id atual
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
