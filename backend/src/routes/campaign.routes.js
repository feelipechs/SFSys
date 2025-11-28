import express from 'express';
import db from '../database/index.js';
import CampaignController from '../controllers/CampaignController.js';
import CampaignService from '../services/CampaignService.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';
import { validateCampaignData } from '../middlewares/CampaignValidationMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Gerenciamento de campanhas

 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       required:
 *         - name
 *         - startDate
 *         - endDate
 *         - status
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *
 *         name:
 *           type: string
 *           description: Nome da campanha.
 *           example: "Campanha de Inverno"
 *
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Data de início da campanha.
 *           example: "2025-03-01T00:00:00.000Z"
 *
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Data final da campanha.
 *           example: "2025-06-01T00:00:00.000Z"
 *
 *         status:
 *           type: string
 *           description: Status atual da campanha.
 *           enum: [inProgress, finished, canceled, pending]
 *           example: "pending"
 *
 *         category:
 *           type: string
 *           description: Categoria da campanha.
 *           enum: [food, clothing, hygiene, others]
 *           example: "food"
 *
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-25T10:20:30.000Z"
 *
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-25T10:20:30.000Z"
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Campanha não encontrada"
 */

const router = express.Router();

const campaignServiceInstance = new CampaignService(db);
const campaignControllerInstance = new CampaignController(
  campaignServiceInstance,
);

router.use(authenticate);

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Cria uma nova Campanha
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     description: Requer role **admin** ou **manager**
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Dados inválidos ou formato incorreto.
 */
router.post(
  '/',
  authorize(['admin', 'manager']),
  validateCampaignData,
  campaignControllerInstance.create,
);

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Lista todas as campanhas
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de campanhas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 */
router.get('/', campaignControllerInstance.findAll);

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Retorna uma Campanha pelo ID
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da campanha.
 *     responses:
 *       200:
 *         description: Campanha encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campanha não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', campaignControllerInstance.findById);

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Atualiza uma Campanha existente
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     description: Requer role **admin** ou **manager**
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       200:
 *         description: Campanha atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Campanha não encontrada.
 */
router.put(
  '/:id',
  authorize(['admin', 'manager']),
  validateCampaignData,
  campaignControllerInstance.update,
);

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Remove uma Campanha
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     description: Requer role **admin** ou **manager**
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Campanha removida com sucesso.
 *       404:
 *         description: Campanha não encontrada.
 */
router.delete(
  '/:id',
  authorize(['admin', 'manager']),
  campaignControllerInstance.delete,
);

export default router;
