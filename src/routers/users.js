import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { getCurrentUserController, updateUserInfoController } from '../controllers/users.js';
import { updateUserSchema } from '../validation/users.js';
import { upload } from '../middlewares/multer.js'; 
import { updateAvatar } from '../controllers/users.js';


const router = Router();

router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.patch('/updateUser/:userId', authenticate, validateBody(updateUserSchema), ctrlWrapper(updateUserInfoController));

router.patch(
  '/avatar',
  authenticate,        
  upload.single('avatar'),   
  ctrlWrapper(updateAvatar) 
);


export default router;
