import express from 'express';
import db from '../database/index.js';
import UserController from '../controllers/UserController.js';
import UserService from '../services/UserService.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';
import { validateUserData } from '../middlewares/UserValidationMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "João Silva"
 *         email:
 *           type: string
 *           example: "joao@email.com"
 *         role:
 *           type: string
 *           enum: [admin, manager, volunteer]
 *           example: "volunteer"
 *
 *     UserPublic:
 *       type: object
 *       description: Usuário retornado em listagens e consultas (sem senha)
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, manager, volunteer]
 *
 *     UserCreateInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           example: "Maria Oliveira"
 *         email:
 *           type: string
 *           example: "maria@email.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "senhaSegura123"
 *         role:
 *           type: string
 *           enum: [admin, manager, volunteer]
 *           example: "volunteer"
 *
 *     UserUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           format: password
 *         role:
 *           type: string
 *           enum: [admin, manager, volunteer]
 *
 *     UserProfileUpdate:
 *       type: object
 *       description: Atualização do próprio usuário autenticado
 *       properties:
 *         name:
 *           type: string
 *           example: "João Atualizado"
 *         email:
 *           type: string
 *           example: "novoemail@email.com"
 *         password:
 *           type: string
 *           example: "novaSenha123"
 *
 *     UserStats:
 *       type: object
 *       properties:
 *         donationsCount:
 *           type: integer
 *           example: 12
 *         distributionsCount:
 *           type: integer
 *           example: 5
 */

const router = express.Router();

const userServiceInstance = new UserService(db);
const userControllerInstance = new UserController(userServiceInstance);

// middleware global — precisa estar autenticado
router.use(authenticate);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublic'
 */
router.get('/me', userControllerInstance.getProfile);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Atualiza o perfil do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileUpdate'
 *     responses:
 *       200:
 *         description: Perfil atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublic'
 */
router.put('/me', validateUserData, userControllerInstance.updateProfile);

/**
 * @swagger
 * /users/me/stats:
 *   get:
 *     summary: Retorna estatísticas do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStats'
 */
router.get('/me/stats', userControllerInstance.getStats);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário (somente admin/manager)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateInput'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublic'
 *       403:
 *         description: Acesso negado.
 */
router.post(
  '/',
  authorize(['admin', 'manager']),
  validateUserData,
  userControllerInstance.create,
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPublic'
 */
router.get('/', userControllerInstance.findAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublic'
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', userControllerInstance.findById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário por ID (somente admin/manager)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublic'
 *       403:
 *         description: Acesso negado
 */
router.put(
  '/:id',
  authorize(['admin', 'manager']),
  validateUserData,
  userControllerInstance.update,
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário (somente admin/manager)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 *       403:
 *         description: Acesso negado
 */
router.delete(
  '/:id',
  authorize(['admin', 'manager']),
  userControllerInstance.delete,
);

export default router;
