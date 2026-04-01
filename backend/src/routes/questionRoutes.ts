import { Router } from 'express';
import { listQuestionsHandler, createQuestionHandler } from '../controllers/questionController';

const router = Router();

router.get('/', listQuestionsHandler);
router.post('/', createQuestionHandler);

export default router;
