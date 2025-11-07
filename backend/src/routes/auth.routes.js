import express from 'express';
import db from '../database/index.js';
import AuthController from '../controllers/AuthController.js';
import AuthService from '../services/AuthService.js';

const router = express.Router();

// instanciação do service, injetando a Model User
// o AuthService precisa apenas da Model User
const authServiceInstance = new AuthService(db.User);

// instanciação do controller, injetando o service
const authControllerInstance = new AuthController(authServiceInstance);

// definição da rota de login (não precisa de middlewares de Auth/Authorize)
// POST /login
router.post('/login', authControllerInstance.login);

// rota opcional para teste rápido de um token (não necessária para o login, mas útil)
// router.get('/validate', authenticate, (req, res) => res.status(200).json({ message: 'Token válido', user: req.user }));

export default router;
