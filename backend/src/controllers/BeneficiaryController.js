class BeneficiaryController {
  // Recebe o Service no construtor (Injeção de Dependência)
  constructor(service) {
    this.service = service;

    // binding de 'this' para manter o escopo no Express
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

  // POST /api/beneficiaries
  async create(req, res) {
    try {
      // Chama o Service da instância
      const newBeneficiary = await this.service.create(req.body);
      return res.status(201).json(newBeneficiary);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // GET /api/beneficiaries
  async findAll(req, res) {
    try {
      const beneficiaries = await this.service.findAll();
      return res.status(200).json(beneficiaries);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // GET /api/beneficiaries/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const beneficiary = await this.service.findById(id);
      return res.status(200).json(beneficiary);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // PUT /api/beneficiaries/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedBeneficiary = await this.service.update(id, req.body);
      return res.status(200).json(updatedBeneficiary);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // DELETE /api/beneficiaries/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      // 204 No Content para deleção bem-sucedida
      return res.status(204).send();
    } catch (error) {
      return this._handleError(res, error);
    }
  }
}

export default BeneficiaryController;
