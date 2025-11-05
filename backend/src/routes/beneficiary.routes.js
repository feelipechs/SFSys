import express from 'express';
import db from '../database/index.js';
import BeneficiaryService from '../services/BeneficiaryService.js';
import BeneficiaryController from '../controllers/BeneficiaryController.js';

const router = express.Router();
// --- Injeção de Dependência e Instanciação ---

// 1. Prepara o que será injetado no Service
const { Beneficiary } = db;

// 2. Cria a instância do Service, INJETANDO o Modelo do Sequelize
const beneficiaryServiceInstance = new BeneficiaryService(Beneficiary);

// 3. Cria a instância do Controller, INJETANDO o Service
const beneficiaryControllerInstance = new BeneficiaryController(
  beneficiaryServiceInstance,
);

// --- Definição das Rotas ---

// Usa os métodos de instância (que já estão "bindados" no Controller)
router.post('/', beneficiaryControllerInstance.create); // POST /api/beneficiaries
router.get('/', beneficiaryControllerInstance.findAll); // GET /api/beneficiaries
router.get('/:id', beneficiaryControllerInstance.findById); // GET /api/beneficiaries/:id
router.put('/:id', beneficiaryControllerInstance.update); // PUT /api/beneficiaries/:id
router.delete('/:id', beneficiaryControllerInstance.destroy); // DELETE /api/beneficiaries/:id

export default router;
