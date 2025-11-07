import { BadRequestError, NotFoundError } from '../utils/api-error.js';

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
  }

  async create(data) {
    // validação básica
    if (!data.email || !data.password || !data.name || !data.role) {
      throw new BadRequestError(
        'Todos os campos obrigatórios devem ser preenchidos.',
      );
    }

    // validação de unicidade
    const existingUser = await this.User.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      // se encontrou, significa que o login já está em uso
      throw new BadRequestError('Email já em uso, escolha outro.');
    }
    // fim da validação

    // O hook beforeCreate no modelo user fará o hashing da senha automaticamente
    const newUser = await this.User.create(data);

    // otimização: garantir que a senha não seja retornada na resposta
    // usa o método getSafeUser para consistência
    return this._getSafeUser(newUser);
  }

  async findAll() {
    return await this.User.findAll({
      attributes: [
        'id',
        'email',
        'name',
        'role',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      order: [['name', 'ASC']],
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

  async update(id, data) {
    const user = await this.findById(id);
    // o hook beforeUpdate no modelo user hasheará a senha SE o campo password estiver presente no data e for diferente do valor atual
    await user.update(data);

    // otimização: retornar o objeto limpo
    return this._getSafeUser(user);
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();
    try {
      const user = await this.findById(id, transaction); // assumindo findById passa a transação

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
