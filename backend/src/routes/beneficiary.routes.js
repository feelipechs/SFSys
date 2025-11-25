import express from 'express';
import db from '../database/index.js';
import AddressService from '../services/AddressService.js';
import BeneficiaryService from '../services/BeneficiaryService.js';
import BeneficiaryController from '../controllers/BeneficiaryController.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Beneficiaries
 *   description: Gerenciamento de beneficiários do projeto
 *
 * components:
 *   schemas:
 *     Beneficiary:
 *       type: object
 *       required:
 *         - responsibleName
 *         - responsibleCpf
 *         - registrationDate
 *         - familyMembersCount
 *         - addressId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID gerado automaticamente.
 *           example: 101
 *
 *         responsibleName:
 *           type: string
 *           description: Nome do responsável familiar.
 *           example: "Maria da Silva"
 *
 *         responsibleCpf:
 *           type: string
 *           description: CPF do responsável (somente números).
 *           example: "12345678900"
 *
 *         registrationDate:
 *           type: string
 *           format: date-time
 *           description: Data de cadastro do beneficiário.
 *           example: "2025-01-20T12:34:56.000Z"
 *
 *         familyMembersCount:
 *           type: integer
 *           description: Quantidade de membros familiares.
 *           example: 4
 *
 *         addressId:
 *           type: integer
 *           description: ID de referência ao endereço cadastrado.
 *           example: 12
 *
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro.
 *           example: "2025-01-20T12:34:56.000Z"
 *
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do registro.
 *           example: "2025-01-20T12:34:56.000Z"
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

const router = express.Router();

const addressServiceInstance = new AddressService(db);

const beneficiaryServiceInstance = new BeneficiaryService(
  db,
  addressServiceInstance,
);

const beneficiaryControllerInstance = new BeneficiaryController(
  beneficiaryServiceInstance,
);

router.use(authenticate);

/**
 * @swagger
 * /beneficiaries:
 *   post:
 *     summary: Cria um novo Beneficiário
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Beneficiary'
 *     responses:
 *       201:
 *         description: Beneficiário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Beneficiary'
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes.
 */
router.post('/', beneficiaryControllerInstance.create);

/**
 * @swagger
 * /beneficiaries:
 *   get:
 *     summary: Lista todos os Beneficiários
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: responsibleName
 *         schema:
 *           type: string
 *         description: Filtra beneficiários pelo nome do responsável.
 *     responses:
 *       200:
 *         description: Uma lista de beneficiários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Beneficiary'
 */
router.get('/', beneficiaryControllerInstance.findAll);

/**
 * @swagger
 * /beneficiaries/{id}:
 *   get:
 *     summary: Retorna um Beneficiário pelo ID
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do beneficiário.
 *     responses:
 *       200:
 *         description: Detalhes do beneficiário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Beneficiary'
 *       404:
 *         description: Beneficiário não encontrado.
 */
router.get('/:id', beneficiaryControllerInstance.findById);

/**
 * @swagger
 * /beneficiaries/{id}:
 *   put:
 *     summary: Atualiza um Beneficiário existente
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do beneficiário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Beneficiary'
 *     responses:
 *       200:
 *         description: Beneficiário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Beneficiary'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Beneficiário não encontrado.
 */
router.put('/:id', beneficiaryControllerInstance.update);

/**
 * @swagger
 * /beneficiaries/{id}:
 *   delete:
 *     summary: Remove um Beneficiário
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do beneficiário.
 *     responses:
 *       204:
 *         description: Beneficiário removido com sucesso.
 *       404:
 *         description: Beneficiário não encontrado.
 */
router.delete('/:id', beneficiaryControllerInstance.delete);

export default router;
