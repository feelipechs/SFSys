import express from 'express';
import db from '../database/index.js';
import StockService from '../services/StockService.js';
import DonationController from '../controllers/DonationController.js';
import DonationService from '../services/DonationService.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Donations
 *   description: Gerenciamento de doações recebidas
 *
 * components:
 *   schemas:
 *     Donation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         dateTime:
 *           type: string
 *           format: date-time
 *           example: "2024-11-20T14:30:00Z"
 *         observation:
 *           type: string
 *           nullable: true
 *           example: "Itens em bom estado"
 *         donorId:
 *           type: integer
 *           example: 12
 *         responsibleUserId:
 *           type: integer
 *           example: 5
 *         campaignId:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         items:
 *           type: array
 *           description: Lista de itens presentes na doação
 *           items:
 *             $ref: '#/components/schemas/DonationItem'
 *
 *     DonationInput:
 *       type: object
 *       required:
 *         - dateTime
 *         - donorId
 *         - responsibleUserId
 *       properties:
 *         dateTime:
 *           type: string
 *           format: date-time
 *           example: "2024-11-20T14:30:00Z"
 *         observation:
 *           type: string
 *           nullable: true
 *           example: "Itens frágeis"
 *         donorId:
 *           type: integer
 *           example: 12
 *         responsibleUserId:
 *           type: integer
 *           example: 5
 *         campaignId:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         items:
 *           type: array
 *           description: Itens da doação
 *           items:
 *             $ref: '#/components/schemas/DonationItemInput'
 *
 *     DonationItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         stockId:
 *           type: integer
 *           example: 10
 *         quantity:
 *           type: number
 *           example: 5
 *         donationId:
 *           type: integer
 *           example: 1
 *
 *     DonationItemInput:
 *       type: object
 *       required:
 *         - stockId
 *         - quantity
 *       properties:
 *         stockId:
 *           type: integer
 *           example: 10
 *         quantity:
 *           type: number
 *           example: 5
 */

const router = express.Router();

const stockServiceInstance = new StockService(db);
const donationServiceInstance = new DonationService(db, stockServiceInstance);
const donationControllerInstance = new DonationController(
  donationServiceInstance,
);

router.use(authenticate);

/**
 * @swagger
 * /donations:
 *   post:
 *     summary: Registra uma nova Doação
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonationInput'
 *     responses:
 *       201:
 *         description: Doação registrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 */
router.post('/', donationControllerInstance.create);

/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Lista todas as Doações
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: donorId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: responsibleUserId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: campaignId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Lista de doações retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donation'
 *       401:
 *         description: Não autorizado.
 */
router.get('/', donationControllerInstance.findAll);

/**
 * @swagger
 * /donations/{id}:
 *   get:
 *     summary: Retorna uma Doação pelo ID
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Doação encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       404:
 *         description: Doação não encontrada.
 *       401:
 *         description: Não autorizado.
 */
router.get('/:id', donationControllerInstance.findById);

/**
 * @swagger
 * /donations/{id}:
 *   put:
 *     summary: Atualiza uma Doação
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da doação a ser atualizada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonationInput'
 *     responses:
 *       200:
 *         description: Doação atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Doação não encontrada.
 *       401:
 *         description: Não autorizado.
 */
router.put('/:id', donationControllerInstance.update);

/**
 * @swagger
 * /donations/{id}:
 *   delete:
 *     summary: Remove uma Doação
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Doação removida com sucesso.
 *       404:
 *         description: Doação não encontrada.
 *       401:
 *         description: Não autorizado.
 */
router.delete('/:id', donationControllerInstance.delete);

export default router;
