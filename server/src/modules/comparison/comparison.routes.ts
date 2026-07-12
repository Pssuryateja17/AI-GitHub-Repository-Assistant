import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { COMPARE_RATE_LIMIT_MAX, COMPARE_RATE_LIMIT_WINDOW_MS } from './comparison.constants';
import { compareRepositoriesHandler } from './comparison.controller';
import { compareRepositoriesSchema } from './comparison.validator';

const compareRateLimiter = rateLimit({
  windowMs: COMPARE_RATE_LIMIT_WINDOW_MS,
  max: COMPARE_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many comparison requests. Please try again later.',
  },
});

const router = Router();

router.post(
  '/compare',
  authenticate,
  compareRateLimiter,
  validate(compareRepositoriesSchema),
  compareRepositoriesHandler,
);

export default router;
