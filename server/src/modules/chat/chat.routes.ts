import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { askChat } from './chat.controller';
import { CHAT_RATE_LIMIT_MAX, CHAT_RATE_LIMIT_WINDOW_MS } from './chat.constants';
import { askChatQuestionSchema } from './chat.validator';

const chatRateLimiter = rateLimit({
  windowMs: CHAT_RATE_LIMIT_WINDOW_MS,
  max: CHAT_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many chat requests. Please try again later.',
  },
});

const router = Router();

router.post('/', authenticate, chatRateLimiter, validate(askChatQuestionSchema), askChat);

export default router;