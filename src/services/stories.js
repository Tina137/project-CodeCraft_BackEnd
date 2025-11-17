import { StoryCollection } from '../db/models/stories.js';
import { UsersCollection } from '../db/models/user.js';
import { CategoriesCollection } from '../db/models/categoory.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';
import createHttpError from 'http-errors';

export const getStories = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'createdAt',
  category,
  ownerId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const filter = {};
  if (category) filter.category = category;
  if (ownerId) filter.ownerId = ownerId;

  const allowedSortFields = [
    'title',
    'article',
    'category',
    'ownerId',
    'favoriteCount',
    'createdAt',
  ];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

  const sortDirection = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

  const storiesCount = await StoryCollection.countDocuments(filter);

  const stories = await StoryCollection.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ [sortField]: sortDirection })
    .populate({
      path: 'ownerId',
      select: 'name avatarUrl',
    })
    .populate({ path: 'category', select: 'name' })
    .exec();

  const paginationData = calculatePaginationData(storiesCount, perPage, page);

  return {
    data: stories,
    ...paginationData,
  };
};

export const getStoryById = async (storyId) => {
  const story = await StoryCollection.findById(storyId);

  if (!story) throw createHttpError(404, 'Story not found');
  return story;
};

export const createStory = async (payload) => {
  const story = await StoryCollection.create(payload);
  await UsersCollection.findByIdAndUpdate(payload.ownerId, {
    $inc: { articlesAmount: 1 },
  });
  return story;
};

export const updateStory = async (storyId, userId, updateData) => {
  const story = await StoryCollection.findById(storyId);

  if (!story) throw createHttpError(404, 'Story not found');

  if (story.ownerId.toString() !== userId.toString()) {
    throw createHttpError(403, 'You can edit only your own stories');
  }

  Object.assign(story, updateData);
  await story.save();

  return story;
};

export const deleteStory = async (storyId, userId) => {
  const story = await StoryCollection.findById(storyId);
  if (!story) throw createHttpError(404, 'Story not found');

  if (story.ownerId.toString() !== userId.toString()) {
    throw createHttpError(403, 'You can delete only your own stories');
  }

  await StoryCollection.findByIdAndDelete(storyId);

  await UsersCollection.updateMany(
    { savedStories: storyId },
    { $pull: { savedStories: storyId } },
  );

  await UsersCollection.findByIdAndUpdate(userId, {
    $inc: { articlesAmount: -1 },
  });

  return story;
};
