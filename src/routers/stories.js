import express from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createStorySchema, updateStorySchema } from '../validation/stories.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.use(authenticate);

export default router;
