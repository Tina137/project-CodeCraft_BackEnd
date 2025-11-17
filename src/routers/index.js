import { Router } from 'express';
import storiesRouter from './stories.js';
import authRouter from './auth.js';
import usersRouter from './users.js';
import categoriesRouter from './categories.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/stories', storiesRouter);
router.use('/categories', categoriesRouter);

export default router;
