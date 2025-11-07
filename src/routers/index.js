import { Router } from 'express';
import storiesRouter from './stories.js';
import authRouter from './auth.js';
import usersRouter from './users.js';

const router = Router();

router.use('/stories', storiesRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);

export default router;
