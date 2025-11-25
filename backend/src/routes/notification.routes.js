import express from 'express';
import db from '../database/index.js';
import NotificationController from '../controllers/NotificationController.js';
import NotificationService from '../services/NotificationService.js';
import { authenticate } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

const notificationServiceInstance = new NotificationService(db);
const notificationControllerInstance = new NotificationController(
  notificationServiceInstance,
);

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Gerenciamento de notificações do usuário
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         userId:
 *           type: integer
 *           example: 3
 *         title:
 *           type: string
 *           example: "Nova doação recebida"
 *         message:
 *           type: string
 *           example: "A doação #45 foi registrada no sistema."
 *         isRead:
 *           type: boolean
 *           example: false
 *         type:
 *           type: string
 *           example: "info"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     NotificationBulkInput:
 *       type: object
 *       required: [userIds, title]
 *       properties:
 *         userIds:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2, 5]
 *         title:
 *           type: string
 *           example: "Aviso importante"
 *         message:
 *           type: string
 *           example: "O sistema ficará fora do ar às 18h."
 *         type:
 *           type: string
 *           example: "warning"
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lista as notificações do usuário autenticado
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Lista de notificações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
router.get('/', notificationControllerInstance.findAll);

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Marca todas as notificações como lidas
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Notificações marcadas como lidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "All notifications marked as read"
 */
router.patch('/read-all', notificationControllerInstance.markAllAsRead);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Marca uma notificação específica como lida
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notificação não encontrada
 */
router.patch('/:id/read', notificationControllerInstance.markAsRead);

/**
 * @swagger
 * /notifications/delete-all:
 *   delete:
 *     summary: Remove todas as notificações do usuário autenticado
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Todas as notificações foram removidas
 *         content:
 *           application/json:
 *             schema:
 *               example:
 *                 message: "All notifications deleted"
 */
router.delete('/delete-all', notificationControllerInstance.deleteAll);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Remove uma notificação específica
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificação removida
 *         content:
 *           application/json:
 *             schema:
 *               example:
 *                 message: "Notification deleted"
 *       404:
 *         description: Notificação não encontrada
 */
router.delete('/:id', notificationControllerInstance.delete);

/**
 * @swagger
 * /notifications/send-bulk:
 *   post:
 *     summary: Envia notificações em massa para múltiplos usuários
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationBulkInput'
 *     responses:
 *       201:
 *         description: Notificações enviadas
 *         content:
 *           application/json:
 *             schema:
 *               example:
 *                 sent: 3
 *                 message: "Notifications sent successfully"
 */
router.post('/send-bulk', notificationControllerInstance.sendBulk);

export default router;
