import { Router } from 'express';
import authRoutes from './auth.routes';
import healthRoutes from './health.routes';
import githubRoutes from '../modules/github/github.routes';
import comparisonRoutes from '../modules/comparison/comparison.routes';
import historyRoutes from '../modules/history/history.routes';
import savedRepositoriesRoutes from '../modules/saved-repositories/savedRepositories.routes';
import chatRoutes from '../modules/chat/chat.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';
import exportRoutes from '../modules/export/export.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/github', githubRoutes);
router.use('/', comparisonRoutes);
router.use('/history', historyRoutes);
router.use('/saved', savedRepositoriesRoutes);
router.use('/chat', chatRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/export', exportRoutes);

export default router;