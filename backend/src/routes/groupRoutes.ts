import { Router } from 'express';
import { createGroupHandler, joinGroupHandler, listUserGroupsHandler } from '../controllers/groupController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, listUserGroupsHandler);
router.post('/', requireAuth, createGroupHandler);
router.post('/join', requireAuth, joinGroupHandler);

export default router;
