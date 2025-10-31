import { Router } from 'express';
import BeneficiaryController from '../controllers/BeneficiaryController.js';
// Importe middlewares de autenticação e autorização, se necessário
// import AuthMiddleware from '../middlewares/AuthMiddleware.js';

const router = Router();

// Rota para criar um novo beneficiário (POST /api/beneficiary)
// Exemplo: router.post('/', AuthMiddleware.check(['manager', 'admin']), BeneficiaryController.create);
router.post('/', BeneficiaryController.create);

// Rota para listar todos os beneficiários (GET /api/beneficiary)
router.get('/', BeneficiaryController.findAll);

// Rota para buscar um beneficiário por ID (GET /api/beneficiary/:id)
router.get('/:id', BeneficiaryController.findById);

// Rota para atualizar um beneficiário (PUT /api/beneficiary/:id)
router.put('/:id', BeneficiaryController.update);

// Rota para deletar um beneficiário (DELETE /api/beneficiary/:id)
router.delete('/:id', BeneficiaryController.destroy);

export default router;
