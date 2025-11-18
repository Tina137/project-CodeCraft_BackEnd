import createHttpError from 'http-errors';
import { HTTP_STATUS } from '../constants/index.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import {
  getStories,
  createStory,
  getStoryById,
  updateStory,
  deleteStory,
} from '../services/stories.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getStoriesController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const { category, ownerId } = req.query;

    const { data, total, hasNextPage, limit } = await getStories({
      page,
      perPage,
      sortBy,
      sortOrder,
      category,
      ownerId,
    });

    res.json({
      status: HTTP_STATUS.OK,
      message: 'Stories fetched successfully',
      page,
      limit, // = perPage
      total, // загальна кількість документів
      hasNextPage, // true / false
      data, // масив сторіс
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
    const storyId = req.params.storyId;
    const file = req.file;
    const userId = req.user._id;

    const body = req.body || {};

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
      if (body[field] !== undefined) {
        updateData[field] = body[field];
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

export const deleteStoryController = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const deletedStory = await deleteStory(storyId, userId);

    res.json({
      status: HTTP_STATUS.OK,
      message: 'Story successfully deleted!',
      data: deletedStory,
    });
  } catch (error) {
    next(error);
  }
};
