class UserService {
  constructor(UserModel) {
    if (!UserModel) {
      throw new Error(
        'O modelo User é obrigatório para inicializar o Service.',
      );
    }

    this.User = UserModel;
  }

  async create(data) {
    // Validação básica
    if (!data.login || !data.password || !data.name) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
    }

    // O Hook 'beforeCreate' no modelo User fará o hashing da senha automaticamente.
    const newUser = await this.User.create(data);

    // Otimização: Garantir que a senha não seja retornada na resposta.
    // Usamos o método getSafeUser que criaremos para consistência.
    return this._getSafeUser(newUser);
  }

  async findAll() {
    return await this.User.findAll({
      attributes: [
        'id',
        'login',
        'name',
        'role',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      order: [['name', 'ASC']],
    });
  }

  async findById(id) {
    const user = await this.User.findByPk(id, {
      attributes: [
        'id',
        'login',
        'name',
        'role',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
    });

    if (!user) {
      throw new Error(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  async update(id, data) {
    const user = await this.findById(id);
    // O Hook 'beforeUpdate' no modelo User hasheará a senha SE o campo 'password'
    // estiver presente no 'data' e for diferente do valor atual.
    await user.update(data);

    // Otimização: Retornar o objeto limpo
    return this._getSafeUser(user);
  }

  async destroy(id) {
    const user = await this.findById(id);

    await user.destroy();
    return true;
  }

  // MÉTODO PRIVADO: Garante que a senha não saia da Service
  _getSafeUser(user) {
    if (!user) return null;

    // Criamos uma cópia limpa do objeto de dados antes de retornar
    const safeData = user.get({ plain: true });
    delete safeData.password;

    return safeData;
  }
}

export default UserService;
