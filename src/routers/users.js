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
  getAllUsersController,
  getUserByIdController,
  updateAvatarController,
} from '../controllers/users.js';
import { updateUserSchema } from '../validation/users.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.get('/', ctrlWrapper(getAllUsersController));

router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.get('/:userId', isValidId, ctrlWrapper(getUserByIdController));

router.patch('/updateUser', authenticate, validateBody(updateUserSchema), ctrlWrapper(updateUserProfileController));
router.patch('/avatar', authenticate, upload.single('avatar'), ctrlWrapper(updateAvatarController));

router.post('/saved/:storyId', isValidId, authenticate, ctrlWrapper(addSavedStoryController));
router.delete('/saved/:storyId', isValidId, authenticate, ctrlWrapper(removeSavedStoryController));

export default router;
