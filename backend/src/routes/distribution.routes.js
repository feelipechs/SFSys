import express from 'express';
import db from '../database/index.js';
import ProductService from '../services/ProductService.js';
import DistributionController from '../controllers/DistributionController.js';
import DistributionService from '../services/DistributionService.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

const productServiceInstance = new ProductService(db);

const distributionServiceInstance = new DistributionService(
  db,
  productServiceInstance,
);

const distributionControllerInstance = new DistributionController(
  distributionServiceInstance,
);

router.use(authenticate);

// POST /api/distributions
router.post('/', distributionControllerInstance.create);

// GET /api/distributions
router.get('/', distributionControllerInstance.findAll);

// GET /api/distributions/:id
router.get('/:id', distributionControllerInstance.findById);

// PUT /api/distributions/:id
router.put('/:id', distributionControllerInstance.update);

// DELETE /api/distributions/:id
router.delete('/:id', distributionControllerInstance.delete);

export default router;
