import { Router } from 'express';
import { createGroupHandler, joinGroupHandler, groupResultsHandler } from '../controllers/groupController';

const router = Router();

router.post('/', createGroupHandler);
router.post('/join', joinGroupHandler);
router.get('/:groupId/results', groupResultsHandler);

export default router;
