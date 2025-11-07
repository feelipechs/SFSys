import express from 'express';
import db from '../database/index.js';
import ProductController from '../controllers/ProductController.js';
import ProductService from '../services/ProductService.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

const productServiceInstance = new ProductService(db);

const productControllerInstance = new ProductController(productServiceInstance);

router.use(authenticate);

// POST /api/products
router.post(
  '/',
  authorize(['admin', 'manager']),
  productControllerInstance.create,
);

// GET /api/products
router.get('/', productControllerInstance.findAll);

// GET /api/products/:id
router.get('/:id', productControllerInstance.findById);

// PUT /api/products/:id
router.put(
  '/:id',
  authorize(['admin', 'manager']),
  productControllerInstance.update,
);

// DELETE /api/products/:id
router.delete(
  '/:id',
  authorize(['admin', 'manager']),
  productControllerInstance.delete,
);

export default router;
