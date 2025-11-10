import { Router } from 'express';
import * as ctrl from '../controllers/auth.js';
import {
  registerSchema,
  loginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post('/register', validateBody(registerSchema), ctrl.registerUserController);
router.post('/login', validateBody(loginSchema), ctrl.loginUserController);
router.post('/logout', authenticate, ctrl.logoutUserController);
router.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrl.requestResetEmailController);
router.post('/reset-password', validateBody(resetPasswordSchema), ctrl.resetPasswordController);

export default router;
