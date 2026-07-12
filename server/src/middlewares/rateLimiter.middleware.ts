import rateLimit from 'express-rate-limit';
import {
  GITHUB_ANALYZE_RATE_LIMIT_MAX,
  GITHUB_ANALYZE_RATE_LIMIT_WINDOW_MS,
} from '../modules/github/github.constants';

export const analyzeRateLimiter = rateLimit({
  windowMs: GITHUB_ANALYZE_RATE_LIMIT_WINDOW_MS,
  max: GITHUB_ANALYZE_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many analysis requests. Please try again later.',
  },
});