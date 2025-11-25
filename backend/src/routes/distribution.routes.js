import express from 'express';
import db from '../database/index.js';
import ProductService from '../services/ProductService.js';
import DistributionController from '../controllers/DistributionController.js';
import DistributionService from '../services/DistributionService.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

const productServiceInstance = new ProductService(db);

const distributionServiceInstance = new DistributionService(
  db,
  productServiceInstance,
);

const distributionControllerInstance = new DistributionController(
  distributionServiceInstance,
);

/**
 * @swagger
 * tags:
 *   name: Distributions
 *   description: Controle de distribuições de cestas básicas

 * components:
 *   schemas:
 *     Distribution:
 *       type: object
 *       required:
 *         - dateTime
 *         - quantityBaskets
 *         - beneficiaryId
 *         - responsibleUserId
 *       properties:
 *         id:
 *           type: integer
 *           example: 44
 *
 *         dateTime:
 *           type: string
 *           format: date-time
 *           description: Data e hora da distribuição.
 *           example: "2025-02-10T14:30:00.000Z"
 *
 *         quantityBaskets:
 *           type: integer
 *           description: Quantidade de cestas entregues.
 *           example: 3
 *
 *         observation:
 *           type: string
 *           nullable: true
 *           description: Observações adicionais.
 *           example: "Beneficiário relatou necessidade de acompanhamento."
 *
 *         beneficiaryId:
 *           type: integer
 *           description: ID do beneficiário associado.
 *           example: 5
 *
 *         responsibleUserId:
 *           type: integer
 *           description: ID do usuário responsável pela entrega.
 *           example: 2
 *
 *         campaignId:
 *           type: integer
 *           nullable: true
 *           description: ID da campanha, caso a distribuição pertença a uma.
 *           example: 8
 *
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-02-10T14:31:00.000Z"
 *
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-02-10T14:31:00.000Z"
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Distribuição não encontrada"
 */

router.use(authenticate);

/**
 * @swagger
 * /distributions:
 *   post:
 *     summary: Cria uma nova distribuição
 *     tags: [Distributions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Distribution'
 *     responses:
 *       201:
 *         description: Distribuição criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Distribution'
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', distributionControllerInstance.create);

/**
 * @swagger
 * /distributions:
 *   get:
 *     summary: Lista todas as distribuições
 *     tags: [Distributions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de distribuições.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Distribution'
 */
router.get('/', distributionControllerInstance.findAll);

/**
 * @swagger
 * /distributions/{id}:
 *   get:
 *     summary: Obtém uma distribuição pelo ID
 *     tags: [Distributions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da distribuição
 *     responses:
 *       200:
 *         description: Distribuição encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Distribution'
 *       404:
 *         description: Distribuição não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', distributionControllerInstance.findById);

/**
 * @swagger
 * /distributions/{id}:
 *   put:
 *     summary: Atualiza uma distribuição
 *     tags: [Distributions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da distribuição
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Distribution'
 *     responses:
 *       200:
 *         description: Distribuição atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Distribution'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Distribuição não encontrada.
 */
router.put('/:id', distributionControllerInstance.update);

/**
 * @swagger
 * /distributions/{id}:
 *   delete:
 *     summary: Remove uma distribuição
 *     tags: [Distributions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da distribuição
 *     responses:
 *       204:
 *         description: Distribuição removida com sucesso.
 *       404:
 *         description: Distribuição não encontrada.
 */
router.delete('/:id', distributionControllerInstance.delete);

export default router;
