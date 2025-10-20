import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

// Rota para Beneficiários (login na tabela Beneficiary)
router.post('/beneficiary/login', AuthController.beneficiaryLogin);
// Rota para Cadastro de Beneficiários (self-service)
router.post('/beneficiary/register', AuthController.beneficiaryRegister);

// Rota para a Equipe (login na tabela Staff)
router.post('/staff/login', AuthController.staffLogin);

// Rota para a criação de Staff (controlada por admin, usando o sistema de convite)
// Nota: Esta rota estaria em staff.routes.js, pois é protegida.

export default router;
