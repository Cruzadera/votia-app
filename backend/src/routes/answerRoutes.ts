import { Router } from 'express';
import { submitAnswerHandler } from '../controllers/answerController';

const router = Router();

router.post('/', submitAnswerHandler);

export default router;
