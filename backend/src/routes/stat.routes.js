import express from 'express';
import db from '../database/index.js';
import StatController from '../controllers/StatController.js';
import StatService from '../services/StatService.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Injeção de dependência
const statServiceInstance = new StatService(db);
const statControllerInstance = new StatController(statServiceInstance);

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Estatísticas gerais do sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     GlobalStats:
 *       type: object
 *       properties:
 *         totalDonations:
 *           type: integer
 *           example: 134
 *         totalDistributions:
 *           type: integer
 *           example: 88
 *         totalUsers:
 *           type: integer
 *           example: 42
 *         totalFamiliesAttended:
 *           type: integer
 *           example: 67
 *
 *     DailyTrendItem:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           example: "2025-01-15"
 *         donations:
 *           type: integer
 *           example: 5
 *         distributions:
 *           type: integer
 *           example: 2
 */

/**
 * @swagger
 * /stats/global:
 *   get:
 *     summary: Retorna estatísticas globais do sistema
 *     tags: [Stats]
 *     description: |
 *       Estatísticas consolidadas do dashboard, incluindo:
 *       - Total de doações
 *       - Total de distribuições
 *       - Total de usuários
 *       - Total de famílias atendidas
 *     responses:
 *       200:
 *         description: Estatísticas globais retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GlobalStats'
 */
router.get('/global', statControllerInstance.getGlobalStats);

/**
 * @swagger
 * /stats/activity-trend:
 *   get:
 *     summary: Retorna o gráfico de atividade diária (últimos N dias)
 *     tags: [Stats]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 90
 *         description: Quantidade de dias anteriores a incluir no gráfico
 *     responses:
 *       200:
 *         description: Lista de dias com contagem de doações e distribuições
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DailyTrendItem'
 */
router.get('/activity-trend', statControllerInstance.getDailyActivityTrend);

export default router;
