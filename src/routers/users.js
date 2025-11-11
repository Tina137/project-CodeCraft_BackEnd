import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getCurrentUserController,
  updateUserInfoController,
  updateAvatar,
  addSavedStoryController,
  removeSavedStoryController,
} from '../controllers/users.js';
import { updateUserSchema } from '../validation/users.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

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

router.post(
  '/saved/:storyId',
  authenticate,
  ctrlWrapper(addSavedStoryController),
);
router.delete(
  '/saved/:storyId',
  authenticate,
  ctrlWrapper(removeSavedStoryController),
);

export default router;
