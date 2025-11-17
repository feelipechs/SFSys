class UserController {
  constructor(service) {
    this.service = service;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    // para /me
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.getStats = this.getStats.bind(this);
  }

  _handleError(res, error) {
    const statusCode = error.status || 500;

    if (statusCode >= 500) {
      console.error(`Erro interno no servidor: ${error.message}`, error.stack);
    }

    return res.status(statusCode).json({
      message: error.message,
      status: statusCode,
    });
  }

  // POST /api/users
  async create(req, res) {
    try {
      const newUser = await this.service.create(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // GET /api/users
  async findAll(req, res) {
    try {
      const users = await this.service.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // GET /api/users/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.service.findById(id);
      return res.status(200).json(user);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // PUT /api/users/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      // captura o usuário que está fazendo a requisição
      const editor = req.user;
      // passa o id do alvo, os dados e o editor para o service
      const user = await this.service.update(id, req.body, editor);
      return res.status(200).json(user);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // DELETE /api/users/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return res.status(204).send();
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // GET /api/users/me (obter o perfil do usuário logado)
  async getProfile(req, res) {
    try {
      // pega o id do usuário do token (middleware authenticate)
      const userId = req.user.id;

      // reutiliza o método findById do Service, mas usando o ID do token
      const user = await this.service.findById(userId);

      if (!user) {
        // embora o authenticate tenha passado, o usuário pode ter sido deletado
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // PUT /api/users/me (novo método para atualizar o perfil do usuário logado)
  async updateProfile(req, res) {
    try {
      // pega o id do usuário do token (middleware authenticate)
      const userId = req.user.id;
      const data = req.body;

      const editor = req.user;

      // reutiliza o método update do Service, mas usando o ID do token
      const updatedUser = await this.service.update(userId, data, editor);

      return res.status(200).json(updatedUser);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  async getStats(req, res) {
    try {
      // o id do usuário logado vem do middleware de autenticação (req.user)
      const userId = req.user.id;
      // chama o service para buscar as estatísticas
      const stats = await this.service.getUserStats(userId);

      return res.status(200).json(stats);
    } catch (error) {
      return this._handleError(res, error);
    }
  }
}

export default UserController;
