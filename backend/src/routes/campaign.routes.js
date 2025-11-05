import express from 'express';
import db from '../database/index.js';
import CampaignController from '../controllers/CampaignController.js';
import CampaignService from '../services/CampaignService.js';

const router = express.Router();

const { Campaign } = db;

const campaignServiceInstance = new CampaignService(Campaign);

const campaignControllerInstance = new CampaignController(
  campaignServiceInstance,
);

router.post('/', campaignControllerInstance.create); // POST /api/campaigns
router.get('/', campaignControllerInstance.findAll); // GET /api/campaigns
router.get('/:id', campaignControllerInstance.findById); // GET /api/campaigns/:id
router.put('/:id', campaignControllerInstance.update); // PUT /api/campaigns/:id
router.delete('/:id', campaignControllerInstance.destroy); // DELETE /api/campaigns/:id

export default router;
