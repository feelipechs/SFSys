import express from 'express';
import db from '../database/index.js';
import DistributionController from '../controllers/DistributionController.js';
import DistributionService from '../services/DistributionService.js';

const router = express.Router();

const { Distribution } = db;

const distributionServiceInstance = new DistributionService(Distribution);

const distributionControllerInstance = new DistributionController(
  distributionServiceInstance,
);

router.post('/', distributionControllerInstance.create);
router.get('/', distributionControllerInstance.findAll);
router.get('/:id', distributionControllerInstance.findById);
router.put('/:id', distributionControllerInstance.update);
router.delete('/:id', distributionControllerInstance.destroy);

export default router;
