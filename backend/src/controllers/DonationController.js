class DonationController {
  constructor(service) {
    this.service = service;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // POST /api/donations
  async create(req, res) {
    try {
      const newDonation = await this.service.create(req.body);
      return res.status(201).json(newDonation);
    } catch (error) {
      console.error('Erro ao criar doação:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /api/donations
  async findAll(req, res) {
    try {
      const donations = await this.service.findAll();
      return res.status(200).json(donations);
    } catch (error) {
      console.error('Erro ao listar doações:', error.message);
      return res.status(500).json({ error: 'Erro interno ao buscar lista.' });
    }
  }

  // GET/api/donations/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const donation = await this.service.findById(id);
      return res.status(200).json(donation);
    } catch (error) {
      console.error('Erro ao buscar doação:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/donations/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedDonation = await this.service.update(id, req.body);
      return res.status(200).json(updatedDonation);
    } catch (error) {
      console.error('Erro ao atualizar doação:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/donations/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar doação:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default DonationController;
