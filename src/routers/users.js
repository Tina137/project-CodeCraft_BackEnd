import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
// import { optionalAuthenticate } from '../middlewares/optionalAuthenticate.js'; // 
import {
  getCurrentUserController,
  updateUserInfoController,
  updateAvatar,
  addSavedStoryController,
  removeSavedStoryController,
} from '../controllers/users.js';
import { updateUserSchema } from '../validation/users.js';
import { upload } from '../middlewares/multer.js';
import {
  getUserByIdController,
  getUsersListController,
} from '../controllers/publicUsers.js';

const router = Router();

router.get('/', ctrlWrapper(getUsersListController));
router.get('/:userId', ctrlWrapper(getUserByIdController));

router.use(authenticate);

router.get('/current', ctrlWrapper(getCurrentUserController));

router.patch('/updateUser', upload.single('avatarUrl'), validateBody(updateUserSchema), ctrlWrapper(updateUserInfoController));
router.patch('/avatar', upload.single('avatar'), ctrlWrapper(updateAvatar));

router.post('/saved/:storyId', ctrlWrapper(addSavedStoryController));
router.delete('/saved/:storyId', ctrlWrapper(removeSavedStoryController));

export default router;
