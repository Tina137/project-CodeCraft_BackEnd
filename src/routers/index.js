import { Router } from 'express';
import storiesRouter from './stories.js';
import authRouter from './auth.js';
import usersRouter from './users.js';


const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/stories', storiesRouter);

export default router;
