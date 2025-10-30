import { Router } from 'express';
// import doadorRoutes from './doador.routes.js';
import beneficiaryRoutes from './beneficiary.routes.js'; // Importação da nova rota
// import authRoutes from './auth.routes.js'; // Mantenha comentado por enquanto

const router = Router();

// As rotas baseadas em Models devem ser agrupadas sob o prefixo /api
// Exemplo: /api/doador, /api/beneficiary
// router.use('/api/doador', doadorRoutes);
router.use('/api/beneficiary', beneficiaryRoutes);

// router.use('/api/auth', authRoutes);

export default router;
