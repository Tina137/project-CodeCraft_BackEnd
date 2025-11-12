import { UsersCollection } from '../db/models/user.js';
import { StoryCollection } from '../db/models/stories.js';
import createHttpError from 'http-errors';

export const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    UsersCollection.find({}, '-password -savedStories -__v')
      .skip(skip)
      .limit(limit),
    UsersCollection.countDocuments(),
  ]);

  return { users, total };
};

export const getUserById = async (userId) => {
  const user = await UsersCollection.findById(userId, '-password -savedStories -__v');
  if (!user) throw createHttpError(404, 'User not found');

  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await UsersCollection.findById(userId);
  if (!user) throw createHttpError(404, 'User not found');

  Object.assign(user, updateData);
  await user.save();

  return user;
};

// Додає історію до збережених користувача
export const addStoryToSaved = async (userId, storyId) => {
  const user = await UsersCollection.findById(userId);
  if (!user) throw createHttpError(404, 'User not found');

  const story = await StoryCollection.findById(storyId);
  if (!story) throw createHttpError(404, 'Story not found');

  if (user.savedStories.some(id => id.toString() === storyId)) {
    throw createHttpError(400, 'Story already saved');
  }

  user.savedStories.push(storyId);
  await user.save();

  story.favoriteCount = (story.favoriteCount || 0) + 1;
  await story.save();

  return user.savedStories;
};

//Видаляє історію зі збережених користувача
export const removeStoryFromSaved = async (userId, storyId) => {
  const user = await UsersCollection.findById(userId);
  if (!user) throw createHttpError(404, 'User not found');

  const story = await StoryCollection.findById(storyId);
  if (!story) throw createHttpError(404, 'Story not found');

  const isSaved = user.savedStories.some(id => id.toString() === storyId);
  if (!isSaved) {
    throw createHttpError(400, 'Story not in saved list');
  }

  user.savedStories = user.savedStories.filter(id => id.toString() !== storyId);
  await user.save();

  story.favoriteCount = Math.max(0, (story.favoriteCount || 0) - 1);
  await story.save();

  return user.savedStories;
};
