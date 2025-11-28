import { BadRequestError } from '../utils/errorUtils.js';

export class BeneficiarySpecification {
  constructor(models) {
    this.Beneficiary = models.Beneficiary;
    this.Op = models.sequelize.constructor.Op;
  }

  async checkCpfUniqueness(cpfValue, beneficiaryId = null) {
    const whereClause = {
      responsibleCpf: cpfValue,
    };

    // se o id for fornecido, exclui o próprio registro para permitir o update
    if (beneficiaryId) {
      whereClause.id = { [this.Op.not]: beneficiaryId };
    }

    const existingBeneficiary = await this.Beneficiary.findOne({
      where: whereClause,
    });

    if (existingBeneficiary) {
      throw new BadRequestError(
        'Já existe um beneficiário cadastrado com este CPF. Verifique a unicidade.',
      );
    }
  }
}
