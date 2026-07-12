import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { analyzeRateLimiter } from '../../middlewares/rateLimiter.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { analyzeRepository } from './github.controller';
import { analyzeRepositorySchema } from './github.validator';

const router = Router();

router.post(
  '/analyze',
  authenticate,
  analyzeRateLimiter,
  validate(analyzeRepositorySchema),
  analyzeRepository,
);

export default router;