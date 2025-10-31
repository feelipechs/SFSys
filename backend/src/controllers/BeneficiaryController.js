import BeneficiaryService from '../services/BeneficiaryService.js';

class BeneficiaryController {
  // POST /api/beneficiary
  static async create(req, res) {
    try {
      const newBeneficiary = await BeneficiaryService.create(req.body);
      return res.status(201).json(newBeneficiary);
    } catch (error) {
      // Se o Service lançar um erro (ex: validação)
      console.error('Erro ao criar beneficiário:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /api/beneficiary
  static async findAll(req, res) {
    try {
      const beneficiaries = await BeneficiaryService.findAll();
      return res.status(200).json(beneficiaries);
    } catch (error) {
      console.error('Erro ao listar beneficiários:', error.message);
      return res.status(500).json({ error: 'Erro interno ao buscar lista.' });
    }
  }

  // GET /api/beneficiary/:id
  static async findById(req, res) {
    try {
      const { id } = req.params;
      const beneficiary = await BeneficiaryService.findById(id);
      return res.status(200).json(beneficiary);
    } catch (error) {
      console.error('Erro ao buscar beneficiário:', error.message);
      // Se o erro vier do findById, geralmente é 404 (Não Encontrado)
      return res.status(404).json({ error: error.message });
    }
  }

  // PUT /api/beneficiary/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updatedBeneficiary = await BeneficiaryService.update(id, req.body);
      return res.status(200).json(updatedBeneficiary);
    } catch (error) {
      console.error('Erro ao atualizar beneficiário:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/beneficiary/:id
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      await BeneficiaryService.destroy(id);
      return res.status(204).send(); // 204 No Content para deleção bem-sucedida
    } catch (error) {
      console.error('Erro ao deletar beneficiário:', error.message);
      return res.status(404).json({ error: error.message });
    }
  }
}

export default BeneficiaryController;
