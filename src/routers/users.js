import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { getCurrentUserController, updateUserInfoController } from '../controllers/users.js';
import { updateUserSchema } from '../validation/users.js';


const router = Router();

router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.patch('/updateUser/:userId', authenticate, validateBody(updateUserSchema), ctrlWrapper(updateUserInfoController));

export default router;
