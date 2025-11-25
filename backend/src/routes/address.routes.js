import express from 'express';
import db from '../database/index.js';
import AddressService from '../services/AddressService.js';
import AddressController from '../controllers/AddressController.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Injeção de dependência
const addressServiceInstance = new AddressService(db);
const addressControllerInstance = new AddressController(addressServiceInstance);

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Gestão de endereços
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         cep:
 *           type: string
 *           example: "89200000"
 *         state:
 *           type: string
 *           example: "SC"
 *         city:
 *           type: string
 *           example: "Joinville"
 *         neighborhood:
 *           type: string
 *           example: "Centro"
 *         street:
 *           type: string
 *           example: "Rua XV de Novembro"
 *         number:
 *           type: string
 *           example: "150"
 *         complement:
 *           type: string
 *           example: "Apartamento 302"
 *         latitude:
 *           type: number
 *           example: -26.304509
 *         longitude:
 *           type: number
 *           example: -48.848661
 *
 *     AddressUpdateInput:
 *       type: object
 *       properties:
 *         cep:
 *           type: string
 *           example: "89200000"
 *         state:
 *           type: string
 *           example: "SC"
 *         city:
 *           type: string
 *           example: "Joinville"
 *         neighborhood:
 *           type: string
 *           example: "Centro"
 *         street:
 *           type: string
 *           example: "Rua XV de Novembro"
 *         number:
 *           type: string
 *           example: "150"
 *         complement:
 *           type: string
 *           example: "Apartamento 302"
 *         latitude:
 *           type: number
 *           example: -26.304509
 *         longitude:
 *           type: number
 *           example: -48.848661
 */

/**
 * @swagger
 * /addresses/cep/{cep}:
 *   get:
 *     summary: Busca endereço por CEP
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: cep
 *         required: true
 *         schema:
 *           type: string
 *         example: "89200000"
 *     responses:
 *       200:
 *         description: Endereço encontrado
 *       404:
 *         description: CEP não encontrado
 */
router.get('/cep/:cep', addressControllerInstance.getByCep);

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Lista todos os endereços
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: Lista de endereços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 */
router.get('/', addressControllerInstance.findAll);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: Busca um endereço pelo ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Endereço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Endereço não encontrado
 */
router.get('/:id', addressControllerInstance.findById);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Atualiza um endereço
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressUpdateInput'
 *     responses:
 *       200:
 *         description: Endereço atualizado
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Endereço não encontrado
 */
router.put('/:id', addressControllerInstance.update);

export default router;
