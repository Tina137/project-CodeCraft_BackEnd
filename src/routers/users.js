import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  getCurrentUserController,
  addSavedStoryController,
  removeSavedStoryController,
  updateUserProfileController,
  updateAvatarController,
} from '../controllers/users.js';
import {
  getUsersListController,
  getPublicUserByIdController,
} from '../controllers/publicUsers.js';
import { updateUserSchema } from '../validation/users.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.get('/', ctrlWrapper(getUsersListController));

router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.get('/:userId', isValidId, ctrlWrapper(getPublicUserByIdController));

router.patch(
  '/updateUser',
  authenticate,
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserProfileController),
);
router.patch(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  ctrlWrapper(updateAvatarController),
);

router.post(
  '/saved/:storyId',
  isValidId,
  authenticate,
  ctrlWrapper(addSavedStoryController),
);
router.delete(
  '/saved/:storyId',
  isValidId,
  authenticate,
  ctrlWrapper(removeSavedStoryController),
);

export default router;
