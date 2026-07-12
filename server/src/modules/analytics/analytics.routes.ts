import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { getAnalyticsOverview } from './analytics.controller';

const router = Router();

router.get('/overview', authenticate, getAnalyticsOverview);

export default router;