import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { optionalAuthenticate } from '../middlewares/optionalAuthenticate.js';
import {
  getCurrentUserController,
  updateUserInfoController,
} from '../controllers/users.js';
import { updateUserSchema } from '../validation/users.js';
import { upload } from '../middlewares/multer.js';
import { updateAvatar } from '../controllers/users.js';

const router = Router();

import {
  getUserByIdController,
  getUsersListController,
} from '../controllers/publicUsers.js';

router.get('/', ctrlWrapper(getUsersListController));
router.get(
  '/:userId',
  optionalAuthenticate,
  ctrlWrapper(getUserByIdController),
);

router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.patch(
  '/updateUser/:userId',
  authenticate,
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserInfoController),
);

router.patch(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  ctrlWrapper(updateAvatar),
);

export default router;
