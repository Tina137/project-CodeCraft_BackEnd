import createHttpError from 'http-errors';
import { getStories } from '../services/stories.js';
import { HTTP_STATUS } from '../constants/index.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { createStory, getStoryById, updateStory } from '../services/stories.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getStoriesController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const { category } = req.query;

    const stories = await getStories({
      page,
      perPage,
      sortBy,
      sortOrder,
      category,
    });

    res.json({
      status: HTTP_STATUS.OK,
      message: 'Successfully found stories!',
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

export const getStoryByIdController = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const story = await getStoryById(storyId);

    res.json({
      status: HTTP_STATUS.OK,
      message: 'Story fetched successfully',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

export const createStoryController = async (req, res, next) => {
  try {
    const { title, article, category } = req.body;
    const file = req.file;

    if (!file) {
      throw createHttpError(400, 'Image is required');
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

    res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: 'Successfully created a story!',
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

    const allowedFields = ['title', 'article', 'category'];
    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (imgUrl) updateData.img = imgUrl;

    const updatedStory = await updateStory(storyId, userId, updateData);

    res.json({
      status: HTTP_STATUS.OK,
      message: 'Successfully updated a story!',
      data: updatedStory,
    });
  } catch (error) {
    next(error);
  }
};
