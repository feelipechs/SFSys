class BeneficiaryController {
  // Recebe o Service no construtor (Injeção de Dependência)
  constructor(service) {
    this.service = service;

    // binding de 'this' para manter o escopo no Express
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  // POST /api/beneficiaries
  async create(req, res) {
    try {
      // Chama o Service da instância
      const newBeneficiary = await this.service.create(req.body);
      return res.status(201).json(newBeneficiary);
    } catch (error) {
      console.error('Erro ao criar beneficiário:', error.message);
      // Usa o status anexado ao erro (se for 400), ou 500 por padrão
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  // GET /api/beneficiaries
  async findAll(req, res) {
    try {
      const beneficiaries = await this.service.findAll();
      return res.status(200).json(beneficiaries);
    } catch (error) {
      console.error('Erro ao listar beneficiários:', error.message);
      return res.status(500).json({ error: 'Erro interno ao buscar lista.' });
    }
  }

  // GET /api/beneficiaries/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const beneficiary = await this.service.findById(id);
      return res.status(200).json(beneficiary);
    } catch (error) {
      console.error('Erro ao buscar beneficiário:', error.message);
      // Trata erros 404 (Not Found) ou outros erros do Service
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  // PUT /api/beneficiaries/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedBeneficiary = await this.service.update(id, req.body);
      return res.status(200).json(updatedBeneficiary);
    } catch (error) {
      console.error('Erro ao atualizar beneficiário:', error.message);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  // DELETE /api/beneficiaries/:id
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await this.service.destroy(id);
      // 204 No Content para deleção bem-sucedida
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar beneficiário:', error.message);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export default BeneficiaryController;
