import express from 'express';
import db from '../database/index.js';
import CampaignController from '../controllers/CampaignController.js';
import CampaignService from '../services/CampaignService.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

const campaignServiceInstance = new CampaignService(db);

const campaignControllerInstance = new CampaignController(
  campaignServiceInstance,
);

router.use(authenticate);

// POST /api/campaigns
router.post(
  '/',
  authorize(['admin', 'manager']),
  campaignControllerInstance.create,
);

// GET /api/campaigns
router.get('/', campaignControllerInstance.findAll);

// GET /api/campaigns/:id
router.get('/:id', campaignControllerInstance.findById);

// PUT /api/campaigns/:id
router.put(
  '/:id',
  authorize(['admin', 'manager']),
  campaignControllerInstance.update,
);

// DELETE /api/campaigns/:id
router.delete(
  '/:id',
  authorize(['admin', 'manager']),
  campaignControllerInstance.delete,
);

export default router;
