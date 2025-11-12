import { Story } from '../db/models/stories.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';
import createHttpError from 'http-errors';

export const getStories = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  category,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const filter = {};
  if (category) {
    filter.category = category;
  }

  const storiesCount = await Story.countDocuments(filter);

  const stories = await Story.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(storiesCount, perPage, page);

  return {
    data: stories,
    ...paginationData,
  };
};

export const getStoryById = async (storyId) => {
  const story = await Story.findById(storyId);

  if (!story) throw createHttpError(404, 'Story not found');
  return story;
};

export const createStory = async (payload) => {
  const story = await Story.create(payload);
  return story;
};

export const updateStory = async (storyId, userId, updateData) => {
  const story = await Story.findById(storyId);

  if (!story) throw createHttpError(404, 'Story not found');

  if (story.ownerId.toString() !== userId.toString()) {
    throw createHttpError(403, 'You can edit only your own stories');
  }

  Object.assign(story, updateData);
  await story.save();

  return story;
};
