class DonorController {
  constructor(service) {
    this.service = service;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  // POST /api/donors
  async create(req, res) {
    try {
      const newDonor = await this.service.create(req.body);
      return res.status(201).json(newDonor);
    } catch (error) {
      console.error('Erro ao criar doador:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /api/donors
  async findAll(req, res) {
    try {
      const donors = await this.service.findAll();
      return res.status(200).json(donors);
    } catch (error) {
      console.error('Erro ao listar doadores:', error.message);
      return res.status(500).json({ error: 'Erro interno ao buscar lista.' });
    }
  }

  // GET /api/donors/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const donor = await this.service.findById(id);
      return res.status(200).json(donor);
    } catch (error) {
      console.error('Erro ao buscar doador:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/donors/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedDonor = await this.service.update(id, req.body);
      return res.status(200).json(updatedDonor);
    } catch (error) {
      console.error('Erro ao atualizar doador:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/donors/:id
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await this.service.destroy(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar doador:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default DonorController;
