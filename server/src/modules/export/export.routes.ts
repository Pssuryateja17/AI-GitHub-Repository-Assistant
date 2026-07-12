import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { exportAnalysis } from './export.controller';
import { exportRequestSchema } from './export.validator';

const router = Router();

router.get('/:format', authenticate, validate(exportRequestSchema), exportAnalysis);

export default router;