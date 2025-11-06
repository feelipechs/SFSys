class DistributionController {
  constructor(service) {
    this.service = service;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // POST /api/distributions
  async create(req, res) {
    try {
      const newDistribution = await this.service.create(req.body);
      return res.status(201).json(newDistribution);
    } catch (error) {
      console.error('Erro ao criar distribuição:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /api/distributions
  async findAll(req, res) {
    try {
      const distributions = await this.service.findAll();
      return res.status(200).json(distributions);
    } catch (error) {
      console.error('Erro ao listar distribuições:', error.message);
      return res.status(500).json({ error: 'Erro interno ao buscar lista.' });
    }
  }

  // GET/api/distributions/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const distribution = await this.service.findById(id);
      return res.status(200).json(distribution);
    } catch (error) {
      console.error('Erro ao buscar distribuição:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/distributions/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedDistribution = await this.service.update(id, req.body);
      return res.status(200).json(updatedDistribution);
    } catch (error) {
      console.error('Erro ao atualizar distribuição:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/distributions/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar distribuição:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default DistributionController;
