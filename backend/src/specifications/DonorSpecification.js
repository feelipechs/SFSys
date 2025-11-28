// src/specifications/DonorSpecification.js
import { BadRequestError } from '../utils/errorUtils.js';

export class DonorSpecification {
  constructor(models) {
    this.Donor = models.Donor;
    this.DonorIndividual = models.DonorIndividual;
    this.DonorLegal = models.DonorLegal;
    this.Op = models.sequelize.constructor.Op;
  }

  async checkDocumentUniqueness(type, documentValue, donorId = null) {
    const isIndividual = type === 'individual';
    const ChildModel = isIndividual ? this.DonorIndividual : this.DonorLegal;
    const uniqueField = isIndividual ? 'cpf' : 'cnpj';

    const whereClause = {
      [uniqueField]: documentValue,
    };

    // exclui o próprio doador no caso de um update
    if (donorId) {
      whereClause.donorId = { [this.Op.not]: donorId };
    }

    const existing = await ChildModel.findOne({ where: whereClause });

    if (existing) {
      throw new BadRequestError(
        `${uniqueField.toUpperCase()} já cadastrado para outro doador.`,
      );
    }
  }

  async checkEmailPhoneUniqueness(data, donorId = null) {
    const uniqueChecks = [];
    const whereClause = {};

    if (data.email) uniqueChecks.push({ email: data.email });
    if (data.phone) uniqueChecks.push({ phone: data.phone });

    if (uniqueChecks.length === 0) return;

    whereClause[this.Op.or] = uniqueChecks;
    // exclui o próprio doador no caso de um update
    if (donorId) {
      whereClause.id = { [this.Op.not]: donorId };
    }

    const existingDonor = await this.Donor.findOne({ where: whereClause });

    if (existingDonor) {
      if (data.email && existingDonor.email === data.email) {
        throw new BadRequestError('E-mail já cadastrado.');
      }
      if (data.phone && existingDonor.phone === data.phone) {
        throw new BadRequestError('Telefone já cadastrado.');
      }
    }
  }
}
