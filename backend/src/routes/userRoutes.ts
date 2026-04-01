import { Router } from 'express';
import { createUserHandler, getUsersHandler } from '../controllers/userController';

const router = Router();

router.post('/', createUserHandler);
router.get('/', getUsersHandler);

export default router;
