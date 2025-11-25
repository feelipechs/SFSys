import express from 'express';
import db from '../database/index.js';
import DonorController from '../controllers/DonorController.js';
import DonorService from '../services/DonorService.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Donors
 *   description: Gerenciamento de doadores
 *
 * components:
 *   schemas:
 *     Donor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           enum: [individual, legal]
 *           description: Tipo de doador (PF ou PJ)
 *           example: "individual"
 *         name:
 *           type: string
 *           example: "Maria Silva"
 *         phone:
 *           type: string
 *           nullable: true
 *           example: "(11) 99999-9999"
 *         email:
 *           type: string
 *           example: "maria@email.com"
 *         individual:
 *           $ref: '#/components/schemas/DonorIndividual'
 *         legal:
 *           $ref: '#/components/schemas/DonorLegal'
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     DonorInput:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - email
 *       properties:
 *         type:
 *           type: string
 *           enum: [individual, legal]
 *           example: "individual"
 *         name:
 *           type: string
 *           example: "Carlos Pereira"
 *         phone:
 *           type: string
 *           example: "(21) 98888-7777"
 *         email:
 *           type: string
 *           example: "carlos@email.com"
 *         individual:
 *           $ref: '#/components/schemas/DonorIndividualInput'
 *         legal:
 *           $ref: '#/components/schemas/DonorLegalInput'
 *
 *     DonorIndividual:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         donorId:
 *           type: integer
 *         cpf:
 *           type: string
 *           example: "123.456.789-00"
 *
 *     DonorIndividualInput:
 *       type: object
 *       required:
 *         - cpf
 *       properties:
 *         cpf:
 *           type: string
 *           example: "123.456.789-00"
 *
 *     DonorLegal:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         donorId:
 *           type: integer
 *         cnpj:
 *           type: string
 *           example: "12.345.678/0001-99"
 *         companyName:
 *           type: string
 *           example: "Empresa XPTO Ltda"
 *
 *     DonorLegalInput:
 *       type: object
 *       required:
 *         - cnpj
 *         - companyName
 *       properties:
 *         cnpj:
 *           type: string
 *           example: "12.345.678/0001-99"
 *         companyName:
 *           type: string
 *           example: "Tech Solutions ME"
 */

const router = express.Router();

const donorServiceInstance = new DonorService(db);
const donorControllerInstance = new DonorController(donorServiceInstance);

router.use(authenticate);

/**
 * @swagger
 * /donors:
 *   post:
 *     summary: Cria um novo Doador (PF ou PJ)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonorInput'
 *     responses:
 *       201:
 *         description: Doador criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 */
router.post('/', donorControllerInstance.create);

/**
 * @swagger
 * /donors:
 *   get:
 *     summary: Lista todos os Doadores
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtra por nome.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [individual, legal]
 *         description: Filtra por tipo de doador.
 *     responses:
 *       200:
 *         description: Lista de doadores retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donor'
 *       401:
 *         description: Não autorizado.
 */
router.get('/', donorControllerInstance.findAll);

/**
 * @swagger
 * /donors/{id}:
 *   get:
 *     summary: Retorna um Doador pelo ID
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do doador.
 *     responses:
 *       200:
 *         description: Doador encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
 *       404:
 *         description: Doador não encontrado.
 *       401:
 *         description: Não autorizado.
 */
router.get('/:id', donorControllerInstance.findById);

/**
 * @swagger
 * /donors/{id}:
 *   put:
 *     summary: Atualiza um Doador existente (PF ou PJ)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do doador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonorInput'
 *     responses:
 *       200:
 *         description: Doador atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Doador não encontrado.
 *       401:
 *         description: Não autorizado.
 */
router.put('/:id', donorControllerInstance.update);

/**
 * @swagger
 * /donors/{id}:
 *   delete:
 *     summary: Remove um Doador
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do doador.
 *     responses:
 *       204:
 *         description: Doador removido com sucesso.
 *       404:
 *         description: Doador não encontrado.
 *       401:
 *         description: Não autorizado.
 */
router.delete('/:id', donorControllerInstance.delete);

export default router;
