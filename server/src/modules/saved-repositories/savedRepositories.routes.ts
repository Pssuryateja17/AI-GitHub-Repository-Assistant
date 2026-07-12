import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  listSavedRepositories,
  saveRepository,
  saveRepositorySchema,
  savedRepositoryIdParamSchema,
  unsaveRepository,
} from './savedRepositories.controller';

const router = Router();

router.post('/', authenticate, validate(saveRepositorySchema), saveRepository);
router.get('/', authenticate, listSavedRepositories);
router.delete('/:id', authenticate, validate(savedRepositoryIdParamSchema), unsaveRepository);

export default router;
