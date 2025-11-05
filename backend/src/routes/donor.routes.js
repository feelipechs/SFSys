import express from 'express';
import db from '../database/index.js';
import DonorController from '../controllers/DonorController.js';
import DonorService from '../services/DonorService.js';

const router = express.Router();

// 1. Instancia o Service, passando o objeto 'db' COMPLETO.
// O Service agora tem acesso a 'db.Donor', 'db.DonorIndividual', e 'db.connection'.
const donorServiceInstance = new DonorService(db);

const donorControllerInstance = new DonorController(donorServiceInstance);

router.post('/', donorControllerInstance.create);
router.get('/', donorControllerInstance.findAll);
router.get('/:id', donorControllerInstance.findById);
router.put('/:id', donorControllerInstance.update);
router.delete('/:id', donorControllerInstance.destroy);

export default router;
