class UserController {
  constructor(service) {
    this.service = service;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
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
      const user = await this.service.update(id, req.body);
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
}

export default UserController;
