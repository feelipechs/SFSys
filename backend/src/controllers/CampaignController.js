class CampaignController {
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

  // POST /api/campaigns
  async create(req, res) {
    try {
      const newCampaign = await this.service.create(req.body);
      return res.status(201).json(newCampaign);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // GET /api/campaigns
  async findAll(req, res) {
    try {
      const campaigns = await this.service.findAll();
      return res.status(200).json(campaigns);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // GET /api/campaigns/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const campaign = await this.service.findById(id);
      return res.status(200).json(campaign);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // PUT /api/campaigns/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedCampaign = await this.service.update(id, req.body);
      return res.status(200).json(updatedCampaign);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // DELETE /api/campaigns/:id
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

export default CampaignController;
