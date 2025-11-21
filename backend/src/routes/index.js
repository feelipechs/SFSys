import { Router } from 'express';
import beneficiaryRoutes from './beneficiary.routes.js';
import campaignRoutes from './campaign.routes.js';
import productRoutes from './product.routes.js';
import userRoutes from './user.routes.js';
import donorRoutes from './donor.routes.js';
import donationRoutes from './donation.routes.js';
import distributionRoutes from './distribution.routes.js';
import authRoutes from './auth.routes.js';
import statRoutes from './stat.routes.js';
import notificationRoutes from './notification.routes.js';

const router = Router();

router.use('/api/beneficiaries', beneficiaryRoutes);
router.use('/api/campaigns', campaignRoutes);
router.use('/api/products', productRoutes);
router.use('/api/users', userRoutes);
router.use('/api/donors', donorRoutes);
router.use('/api/donations', donationRoutes);
router.use('/api/distributions', distributionRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/stats', statRoutes);
router.use('/api/notifications', notificationRoutes);

export default router;
