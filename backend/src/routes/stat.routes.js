import express from 'express';
import db from '../database/index.js';
import StatController from '../controllers/StatController.js';
import StatService from '../services/StatService.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

const statServiceInstance = new StatService(db);

const statControllerInstance = new StatController(statServiceInstance);

router.use(authenticate);

// rota para estatísticas globais do dashboard
// requer autenticação, mas não autorização específica, pois é a visão geral do sistema
router.get('/global', statControllerInstance.getGlobalStats);

router.get('/activity-trend', statControllerInstance.getDailyActivityTrend);

export default router;
