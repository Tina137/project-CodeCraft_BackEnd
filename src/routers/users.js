import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { upload } from '../middlewares/multer.js'; 
import { updateAvatar } from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

// Приватний ендпоінт для оновлення аватару
router.patch(
  '/avatar',
  authenticate,        
  upload.single('avatar'),   
  ctrlWrapper(updateAvatar) 
);


export default router;
