import createHttpError from 'http-errors';
import {} from '../services/stories.js';

import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { createStory, getStoryById, updateStory } from '../services/stories.js';

export const createStoryController = async (req, res, next) => {
  try {
    const { title, article, category } = req.body;
    const file = req.file;

    if (!title || !article || !category) {
      throw createHttpError(400, 'Please provide all required fields');
    }

    let imgUrl;

    if (file) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        imgUrl = await saveFileToCloudinary(file);
      } else {
        imgUrl = await saveFileToUploadDir(file);
      }
    }

    const story = await createStory({
      title,
      article,
      category,
      img: imgUrl,
      ownerId: req.user._id,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a story!',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

export const getStoryByIdController = async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await getStoryById(storyId);

    res.json({
      status: 200,
      message: 'Story fetched successfully',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStoryController = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const file = req.file;
    const userId = req.user._id;

    let imgUrl;

    if (file) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        imgUrl = await saveFileToCloudinary(file);
      } else {
        imgUrl = await saveFileToUploadDir(file);
      }
    }

    const updateData = {
      ...req.body,
    };

    if (imgUrl) updateData.img = imgUrl;

    const updatedStory = await updateStory(storyId, userId, updateData);

    res.json({
      status: 200,
      message: 'Successfully updated a story!',
      data: updatedStory,
    });
  } catch (error) {
    next(error);
  }
};
