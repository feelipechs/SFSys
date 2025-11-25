import express from 'express';
import db from '../database/index.js';
import AddressService from '../services/AddressService.js';
import AddressController from '../controllers/AddressController.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// injeção de dependência e instanciação
const addressServiceInstance = new AddressService(db);
const addressControllerInstance = new AddressController(addressServiceInstance);

router.use(authenticate);

// rota para buscar CEP
// GET /api/addresses/cep/:cep
router.get('/cep/:cep', addressControllerInstance.getByCep);

// GET /api/addresses
router.get('/', addressControllerInstance.findAll);

// GET /api/addresses/:id
router.get('/:id', addressControllerInstance.findById);

// PUT /api/addresses/:id
router.put('/:id', addressControllerInstance.update);

export default router;
