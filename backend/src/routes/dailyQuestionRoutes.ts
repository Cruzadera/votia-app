import { Router } from 'express';
import { getDailyQuestionHandler } from '../controllers/dailyQuestionController';

const router = Router();

router.get('/:groupId', getDailyQuestionHandler);

export default router;
