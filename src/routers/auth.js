
import express from 'express';
import * as ctrl from '../controllers/auth.js'; 

import { validateBody, registerSchema } from '../validation/auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrl.register);

router.post('/logout', authenticate, ctrl.logout);

export default router;