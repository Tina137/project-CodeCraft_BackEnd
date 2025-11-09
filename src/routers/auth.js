import { Router } from 'express';
import { register, loginUserController } from '../controllers/auth.js';
import { validateBody, registerSchema, loginSchema } from '../validation/auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login',    validateBody(loginSchema),    loginUserController);
router.post('/logout', authenticate, ctrl.logout);

export default router;
