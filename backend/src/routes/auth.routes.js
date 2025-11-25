import express from 'express';
import db from '../database/index.js';
import AuthController from '../controllers/AuthController.js';
import AuthService from '../services/AuthService.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "user@mail.com"
 *         password:
 *           type: string
 *           example: "123456"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           example:
 *             id: 1
 *             name: "João da Silva"
 *             email: "user@mail.com"
 *             role: "admin"
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     RefreshRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     RefreshResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: "novo_access_token_gerado..."
 *
 *     LogoutRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Logout realizado com sucesso."
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const router = express.Router();

// instanciação do service, injetando a Model User + RefreshToken
const authServiceInstance = new AuthService(db.User, db.RefreshToken);

// instanciação do controller
const authControllerInstance = new AuthController(authServiceInstance);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login e retorna o access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         headers:
 *           Set-Cookie:
 *             description: >
 *               O refresh token é enviado como cookie HttpOnly com o nome `refresh_token`.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Campos ausentes
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', authControllerInstance.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Gera um novo access token usando o refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       200:
 *         description: Novo access token gerado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
 *       400:
 *         description: Refresh token ausente
 *       401:
 *         description: Refresh token inválido ou expirado
 */
router.post('/refresh', authControllerInstance.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Finaliza a sessão removendo o refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutRequest'
 *     responses:
 *       200:
 *         description: Logout efetuado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       400:
 *         description: Refresh token ausente
 *       401:
 *         description: Refresh token inválido
 */
router.post('/logout', authControllerInstance.logout);

export default router;
