import express from 'express';
import db from '../database/index.js';
import DonorController from '../controllers/DonorController.js';
import DonorService from '../services/DonorService.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// instancia o service, passando o objeto db completo
// o service agora tem acesso a db.Donor, db.DonorIndividual, e db.connection
const donorServiceInstance = new DonorService(db);

const donorControllerInstance = new DonorController(donorServiceInstance);

router.use(authenticate);

// POST /api/donors
router.post('/', donorControllerInstance.create);

// GET /api/donors
router.get('/', donorControllerInstance.findAll);

// GET /api/donors/:id
router.get('/:id', donorControllerInstance.findById);

// PUT /api/donors/:id
router.put('/:id', donorControllerInstance.update);

// DELETE /api/donors/:id
router.delete('/:id', donorControllerInstance.delete);

export default router;
