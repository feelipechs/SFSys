import { BadRequestError } from '../utils/errorUtils.js';

const ADMIN_ROLE = 'admin';

export class UserSpecification {
  constructor(models) {
    this.User = models.User;
    this.Donation = models.Donation;
    this.Distribution = models.Distribution;
    this.Op = models.sequelize.constructor.Op;
  }

  async checkEmailUniqueness(email, userId = null) {
    const whereClause = { email: email };

    // exclui o próprio usuário no caso de um update
    if (userId) {
      whereClause.id = { [this.Op.not]: userId };
    }

    const existingUser = await this.User.findOne({ where: whereClause });

    if (existingUser) {
      throw new BadRequestError('Email já em uso, escolha outro.');
    }
  }

  async checkAdminCreationLimit() {
    const adminCount = await this.User.count({
      where: { role: ADMIN_ROLE },
    });

    if (adminCount >= 1) {
      throw new BadRequestError(
        'A criação de administradores é limitada a um único usuário no sistema.',
      );
    }
  }

  async checkAdminDemotion(userId, newRole) {
    // se a role não está sendo alterada, ou se a nova role é a mesma, não checa
    if (!newRole || newRole === ADMIN_ROLE) return;

    const user = await this.User.findByPk(userId);

    // checa se o usuário atual é admin e está tentando mudar para outra role
    if (user.role === ADMIN_ROLE) {
      const adminCount = await this.User.count({
        where: { role: ADMIN_ROLE },
      });

      if (adminCount === 1) {
        throw new BadRequestError(
          'Não é possível rebaixar o único administrador do sistema, pois ele garante o acesso à manutenção.',
        );
      }
    }
  }

  async checkAuditHistory(userId, transaction) {
    const hasDonations = await this.Donation.count({
      where: { responsibleUserId: userId },
      transaction,
    });

    const hasDistributions = await this.Distribution.count({
      where: { responsibleUserId: userId },
      transaction,
    });

    if (hasDonations > 0 || hasDistributions > 0) {
      throw new BadRequestError(
        'Não é possível excluir este usuário. Ele está associado a transações históricas (doações ou distribuições).',
      );
    }
  }
}
