import express from 'express';
import db from '../database/index.js';
import BeneficiaryService from '../services/BeneficiaryService.js';
import BeneficiaryController from '../controllers/BeneficiaryController.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';

const router = express.Router();
// injeção de dependência e instanciação

// prepara o que será injetado no service (removi a model)

// cria a instância do service, injetando o Modelo do Sequelize (todas)
const beneficiaryServiceInstance = new BeneficiaryService(db);

// cria a instância do controller, injetando o service
const beneficiaryControllerInstance = new BeneficiaryController(
  beneficiaryServiceInstance,
);

router.use(authenticate);

// definição das rotas autenticadas, as que não possuem role explicita quer dizer que todos podem acessar

// usa os métodos de instância (que já estão "bindados" no controller)
// POST /api/beneficiaries
router.post('/', beneficiaryControllerInstance.create);

// GET /api/beneficiaries
router.get('/', beneficiaryControllerInstance.findAll);

// GET /api/beneficiaries/:id
router.get('/:id', beneficiaryControllerInstance.findById);

// PUT /api/beneficiaries/:id
router.put('/:id', beneficiaryControllerInstance.update);

// DELETE /api/beneficiaries/:id
router.delete('/:id', beneficiaryControllerInstance.delete);

export default router;
