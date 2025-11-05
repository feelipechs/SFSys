import { Router } from 'express';
// import doadorRoutes from './doador.routes.js';
import beneficiaryRoutes from './beneficiary.routes.js'; // Importação da nova rota
import campaignRoutes from './campaign.routes.js';
import productRoutes from './product.routes.js';
import userRoutes from './user.routes.js';
import donorRoutes from './donor.routes.js';
import donationRoutes from './donation.routes.js';
// import authRoutes from './auth.routes.js'; // Mantenha comentado por enquanto

const router = Router();

// As rotas baseadas em Models devem ser agrupadas sob o prefixo /api
// Exemplo: /api/doador, /api/beneficiary
// router.use('/api/doador', doadorRoutes);
router.use('/api/beneficiaries', beneficiaryRoutes);
router.use('/api/campaigns', campaignRoutes);
router.use('/api/products', productRoutes);
router.use('/api/users', userRoutes);
router.use('/api/donors', donorRoutes);
router.use('/api/donations', donationRoutes);

// router.use('/api/auth', authRoutes);

export default router;
