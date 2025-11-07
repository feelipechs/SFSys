import express from 'express';
import db from '../database/index.js';
import UserController from '../controllers/UserController.js';
import UserService from '../services/UserService.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

const userServiceInstance = new UserService(db);

const userControllerInstance = new UserController(userServiceInstance);

router.use(authenticate);

router.post(
  '/',
  authorize(['admin', 'manager']),
  userControllerInstance.create,
);

router.get(
  '/',
  authorize(['admin', 'manager']),
  userControllerInstance.findAll,
);

router.get(
  '/:id',
  authorize(['admin', 'manager']),
  userControllerInstance.findById,
);

router.put(
  '/:id',
  authorize(['admin', 'manager']),
  userControllerInstance.update,
);

router.delete(
  '/:id',
  authorize(['admin', 'manager']),
  userControllerInstance.delete,
);

export default router;
