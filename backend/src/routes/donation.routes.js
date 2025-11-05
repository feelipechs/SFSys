import express from 'express';
import db from '../database/index.js';
import DonationController from '../controllers/DonationController.js';
import DonationService from '../services/DonationService.js';

const router = express.Router();

const { Donation } = db;

const donationServiceInstance = new DonationService(Donation);

const donationControllerInstance = new DonationController(
  donationServiceInstance,
);

router.post('/', donationControllerInstance.create);
router.get('/', donationControllerInstance.findAll);
router.get('/:id', donationControllerInstance.findById);
router.put('/:id', donationControllerInstance.update);
router.delete('/:id', donationControllerInstance.destroy);

export default router;
