import express from 'express';
import db from '../database/index.js';
import DonationController from '../controllers/DonationController.js';
import DonationService from '../services/DonationService.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

const donationServiceInstance = new DonationService(db);

const donationControllerInstance = new DonationController(
  donationServiceInstance,
);

router.use(authenticate);

// POST /api/donations
router.post('/', donationControllerInstance.create);

// GET /api/donations
router.get('/', donationControllerInstance.findAll);

// GET /api/donations/:id
router.get('/:id', donationControllerInstance.findById);

// PUT /api/donations/:id
router.put('/:id', donationControllerInstance.update);

// DELETE /api/donations/:id
router.delete('/:id', donationControllerInstance.delete);

export default router;
