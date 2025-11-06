class CampaignController {
  constructor(service) {
    this.service = service;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // POST /api/campaigns
  async create(req, res) {
    try {
      const newCampaign = await this.service.create(req.body);
      return res.status(201).json(newCampaign);
    } catch (error) {
      console.error('Erro ao criar campanha:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /api/campaigns
  async findAll(req, res) {
    try {
      const campaigns = await this.service.findAll();
      return res.status(200).json(campaigns);
    } catch (error) {
      console.error('Erro ao listar campanhas:', error.message);
      return res.status(500).json({ error: 'Erro interno ao buscar lista.' });
    }
  }

  // GET /api/campaigns/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const campaign = await this.service.findById(id);
      return res.status(200).json(campaign);
    } catch (error) {
      console.error('Erro ao buscar campanha:', error.message);
      return res.status(404).json({ error: error.message });
    }
  }

  // PUT /api/campaigns/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedCampaign = await this.service.update(id, req.body);
      return res.status(200).json(updatedCampaign);
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/campaigns/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar campanha:', error.message);
      return res.status(404).json({ error: error.message });
    }
  }
}

export default CampaignController;
