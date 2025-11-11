import express from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createStorySchema, updateStorySchema } from '../validation/stories.js';
import {
  createStoryController,
  getStoryByIdController,
  updateStoryController,
} from '../controllers/stories.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  upload.single('img'),
  validateBody(createStorySchema),
  ctrlWrapper(createStoryController),
);

router.get('/:storyId', isValidId, ctrlWrapper(getStoryByIdController));

router.patch(
  '/:storyId',
  isValidId,
  upload.single('img'),
  validateBody(updateStorySchema),
  ctrlWrapper(updateStoryController),
);

export default router;
