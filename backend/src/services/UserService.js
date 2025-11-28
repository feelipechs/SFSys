import { UserSpecification } from '../specifications/UserSpecification.js';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../utils/errorUtils.js';

class UserService {
  constructor(models) {
    if (
      !models ||
      !models.User ||
      !models.Donation ||
      !models.Distribution ||
      !models.sequelize
    ) {
      throw new Error(
        'O modelo User é obrigatório para inicializar o Service.',
      );
    }

    this.User = models.User;
    this.Donation = models.Donation;
    this.Distribution = models.Distribution;
    this.sequelize = models.sequelize;
    this.specification = new UserSpecification(models);
  }

  async create(data) {
    await this.specification.checkEmailUniqueness(data.email);

    if (data.role === 'admin') {
      await this.specification.checkAdminCreationLimit();
    }

    // o hook beforeCreate no modelo user fará o hashing da senha
    const newUser = await this.User.create(data);

    // retorna o objeto limpo
    return this._getSafeUser(newUser);
  }

  async findAll(params = { sort: 'name', order: 'ASC' }) {
    const { sort, order } = params;

    // cria a cláusula de ordenação dinâmica para o Sequelize
    const orderClause = [[sort, order.toUpperCase()]];

    // executa a consulta ao banco de dados
    return await this.User.findAll({
      attributes: [
        'id',
        'email',
        'name',
        'role',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      order: orderClause,
    });
  }

  async findById(id, transaction = null) {
    const user = await this.User.findByPk(id, {
      attributes: [
        'id',
        'email',
        'name',
        'role',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
    });

    if (!user) {
      throw new NotFoundError(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  async update(id, data, editor) {
    const user = await this.findById(id);
    const updatedRole = data.role;
    const originalRole = user.role;

    const isEditingSelf = editor.id === id;

    // bloqueia update de senhas de outros, a menos que o editor seja admin
    if (data.password && !isEditingSelf && editor.role !== 'admin') {
      throw new ForbiddenError(
        'Você não tem permissão para alterar a senha de outros usuários.',
      );
    }

    if (updatedRole === 'admin' && originalRole !== 'admin') {
      await this.specification.checkAdminCreationLimit();
    }

    if (updatedRole) {
      // só checa se a role está sendo alterada
      await this.specification.checkAdminDemotion(id, updatedRole);
    }

    if (data.email && data.email !== user.email) {
      await this.specification.checkEmailUniqueness(data.email, id);
    }

    await user.update(data);

    return this._getSafeUser(user);
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();
    try {
      const user = await this.findById(id, transaction);

      // bloqueio de exclusão de admin
      if (user.role === 'admin') {
        throw new BadRequestError(
          'A exclusão de usuários com a role "admin" não é permitida.',
        );
      }

      // checagem de doações
      const hasDonations = await this.Donation.count({
        where: { responsibleUserId: id },
        transaction,
      });

      // checagem de distribuições
      const hasDistributions = await this.Distribution.count({
        where: { responsibleUserId: id },
        transaction,
      });

      // bloqueio
      if (hasDonations > 0 || hasDistributions > 0) {
        throw new BadRequestError(
          'Não é possível excluir este usuário. Ele está associado a transações históricas (doações ou distribuições).',
        );
      }

      // se não houver histórico, procede com a exclusão (soft delete idealmente)
      await user.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // retorna a contagem de entidades criadas pelo usuário
  async getUserStats(userId) {
    if (!userId) {
      throw new BadRequestError(
        'O ID do usuário é obrigatório para buscar estatísticas.',
      );
    }

    // contagem de doações
    const registeredDonations = await this.Donation.count({
      where: {
        responsibleUserId: userId,
      },
    });

    // contagem de distribuições
    const registeredDistributions = await this.Distribution.count({
      where: {
        responsibleUserId: userId,
      },
    });

    return {
      registeredDonations,
      registeredDistributions,
    };
  }

  // método para que a senha não saia da service
  _getSafeUser(user) {
    if (!user) return null;

    // cria uma cópia limpa do objeto de dados antes de retornar
    const safeData = user.get({ plain: true });
    delete safeData.password;

    return safeData;
  }
}

export default UserService;
