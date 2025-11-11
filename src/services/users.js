import { UsersCollection } from '../db/models/user.js';
import { StoryCollection } from '../db/models/stories.js';
import createHttpError from 'http-errors';

export const updateUserInfo = async (userId, payload) => {
  const userUpdate = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    payload,
    { new: true },
  );

  return userUpdate;
};

// функція для оновлення аватару
export const updateUserAvatar = async (userId, filename) => {
  const avatarPath = `/uploads/avatars/${filename}`;

  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { avatarUrl: avatarPath },
    { new: true },
  );

  return updatedUser;
};

// Додає історію до збережених користувача
export const addStoryToSaved = async (userId, storyId) => {
  const user = await UsersCollection.findById(userId);
  if (!user) throw createHttpError(404, 'User not found');

  const story = await StoryCollection.findById(storyId);
  if (!story) throw createHttpError(404, 'Story not found');

  if (user.savedStories.includes(storyId)) {
    throw createHttpError(400, 'Story already saved');
  }

  user.savedStories.push(storyId);
  await user.save();

  story.favoriteCount += 1;
  await story.save();

  return user.savedStories;
};

//Видаляє історію зі збережених користувача
export const removeStoryFromSaved = async (userId, storyId) => {
  const user = await UsersCollection.findById(userId);
  if (!user) throw createHttpError(404, 'User not found');

  const story = await StoryCollection.findById(storyId);
  if (!story) throw createHttpError(404, 'Story not found');

  if (!user.savedStories.includes(storyId)) {
    throw createHttpError(400, 'Story not in saved list');
  }

  user.savedStories = user.savedStories.filter(
    (id) => id.toString() !== storyId,
  );
  await user.save();

  story.favoriteCount = Math.max(0, story.favoriteCount - 1);
  await story.save();

  return user.savedStories;
};
