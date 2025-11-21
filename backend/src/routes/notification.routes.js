import express from 'express';
import db from '../database/index.js';
import NotificationController from '../controllers/NotificationController.js';
import NotificationService from '../services/NotificationService.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

const notificationServiceInstance = new NotificationService(db);

const notificationControllerInstance = new NotificationController(
  notificationServiceInstance,
);

router.use(authenticate);

router.get('/', notificationControllerInstance.findAll);
router.patch('/read-all', notificationControllerInstance.markAllAsRead);
router.patch('/:id/read', notificationControllerInstance.markAsRead);
router.delete('/delete-all', notificationControllerInstance.deleteAll);
router.delete('/:id', notificationControllerInstance.delete);
router.post('/send-bulk', notificationControllerInstance.sendBulk);

export default router;
