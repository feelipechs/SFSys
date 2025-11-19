import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../utils/api-error.js';
import { DataValidator } from '../utils/validator.js';

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

    // validação de email
    if (!DataValidator.isValidEmail(data.email)) {
      throw new BadRequestError('O formato do email fornecido é inválido.');
    }

    if (!DataValidator.isValidPassword(data.password, true)) {
      throw new BadRequestError(
        'A senha não atende aos requisitos de segurança (min. 8 caracteres, maiúscula, minúscula, número e símbolo).',
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

    // permite apenas um admin
    if (data.role === 'admin') {
      const adminCount = await this.User.count({
        where: { role: 'admin' },
      });

      if (adminCount >= 1) {
        throw new BadRequestError(
          'A criação de administradores é limitada a um único usuário no sistema.',
        );
      }
    }

    // o hook beforeCreate no modelo user fará o hashing da senha automaticamente
    const newUser = await this.User.create(data);

    // otimização: garantir que a senha não seja retornada na resposta
    // usa o método getSafeUser para consistência
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
    const updatedRole = data.role; // pega a nova role se estiver sendo atualizada
    const originalRole = user.role; // pega a role atual do usuário

    // bloqueia update de senhas de outros
    const isEditingSelf = editor.id === id;

    // se a senha estiver presente no payload e o editor NÃO for o próprio usuário e o editor NÃO for um 'admin'
    if (data.password && !isEditingSelf && editor.role !== 'admin') {
      const error = new ForbiddenError(
        'Você não tem permissão para alterar a senha de outros usuários.',
      );
      throw error;
    }

    if (!DataValidator.isValidPassword(data.password, false)) {
      throw new BadRequestError(
        'A nova senha não atende aos requisitos de segurança.',
      );
    }

    // bloqueio contra promoção de um novo admin (limite de 1)
    if (updatedRole === 'admin' && originalRole !== 'admin') {
      const adminCount = await this.User.count({
        where: { role: 'admin' },
      });

      if (adminCount >= 1) {
        throw new BadRequestError(
          'Não é permitido criar um segundo administrador. O limite é de um admin por sistema.',
        );
      }
    }

    // bloqueio contra rebaixamento do único admin
    // se o usuário atual é o admin e a atualização tenta mudar a role dele para outra coisa
    if (originalRole === 'admin' && updatedRole && updatedRole !== 'admin') {
      // como o sistema só permite 1 admin, se o "user" que estamos atualizando é 'admin', ele é, por definição, o único. Mas checar a contagem é a forma mais segura de garantir que o sistema nunca fique sem admin (embora redundante aqui).
      const adminCount = await this.User.count({
        where: { role: 'admin' },
      });

      if (adminCount === 1) {
        throw new BadRequestError(
          'Não é possível rebaixar o único administrador do sistema, pois ele garante o acesso à manutenção.',
        );
      }
    }

    // validação de email
    if (data.email && !DataValidator.isValidEmail(data.email)) {
      throw new BadRequestError('O formato do email fornecido é inválido.');
    }

    // checar unicidade do email
    if (data.email && data.email !== user.email) {
      const existingUser = await this.User.findOne({
        where: { email: data.email },
      });
      if (existingUser) {
        throw new BadRequestError('Email já em uso, escolha outro.');
      }
    }

    // o hook beforeUpdate no modelo user hasheará a senha SE o campo password estiver presente no data e for diferente do valor atual
    await user.update(data);

    // otimização: retornar o objeto limpo
    return this._getSafeUser(user);
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();
    try {
      const user = await this.findById(id, transaction); // assumindo findById passa a transação

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
