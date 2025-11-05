import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

// Rota para a Equipe (login na tabela User)
router.post('/user/login', AuthController.userLogin);

// Rota para a criação de User (controlada por admin, usando o sistema de convite)
// Nota: Esta rota estaria em user.routes.js, pois é protegida.

export default router;
