import { Router } from 'express';
import { register, loginUserController } from '../controllers/auth.js';
import { validateBody, registerSchema, loginSchema } from '../validation/auth.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login',    validateBody(loginSchema),    loginUserController);

export default router;
