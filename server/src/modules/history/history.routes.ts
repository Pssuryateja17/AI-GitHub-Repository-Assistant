import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  deleteHistoryEntry,
  listAnalysisHistory,
  saveAnalysisHistory,
} from './history.controller';
import {
  historyIdParamSchema,
  listAnalysisHistorySchema,
  saveAnalysisHistorySchema,
} from './history.validator';

const router = Router();

router.post('/save', authenticate, validate(saveAnalysisHistorySchema), saveAnalysisHistory);
router.get('/', authenticate, validate(listAnalysisHistorySchema), listAnalysisHistory);
router.delete('/:id', authenticate, validate(historyIdParamSchema), deleteHistoryEntry);

export default router;
