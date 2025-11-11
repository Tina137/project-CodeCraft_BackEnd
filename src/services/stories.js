import { Story } from '../db/models/stories.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';
import createHttpError from 'http-errors';

export const createStory = async (payload) => {
  const story = await Story.create(payload);
  return story;
};

export const getStoryById = async (storyId) => {
  const story = await Story.findById(storyId)
    .populate('category')
    .populate('ownerId');
  if (!story) throw createHttpError(404, 'Story not found');
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
