class UserController {
  constructor(service) {
    this.service = service;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // POST /api/users
  async create(req, res) {
    try {
      const newUser = await this.service.create(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Erro ao criar usuário:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /api/users
  async findAll(req, res) {
    try {
      const users = await this.service.findAll();
      return res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /api/users/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.service.findById(id);
      return res.status(200).json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/users/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const user = await this.service.update(id, req.body);
      return res.status(200).json(user);
    } catch (error) {
      console.error('Erro ao atualizar usuário', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/users/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar usuário', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
