import express from 'express';
import db from '../database/index.js';
import ProductController from '../controllers/ProductController.js';
import ProductService from '../services/ProductService.js';

const router = express.Router();

const { Product } = db;

const productServiceInstance = new ProductService(Product);

const productControllerInstance = new ProductController(productServiceInstance);

router.post('/', productControllerInstance.create);
router.get('/', productControllerInstance.findAll);
router.get('/:id', productControllerInstance.findById);
router.put('/:id', productControllerInstance.update);
router.delete('/:id', productControllerInstance.delete);

export default router;
