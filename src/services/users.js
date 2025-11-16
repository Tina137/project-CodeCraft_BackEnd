import { UsersCollection } from '../db/models/user.js';
import { StoryCollection } from '../db/models/stories.js';
import createHttpError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

// Отримати всіх користувачів з пагінацією
export const getAllUsers = async (page = 1, perPage = 10) => {
  const skip = (page - 1) * perPage;

  const [users, totalItems] = await Promise.all([
    UsersCollection.find({}, '-password -savedStories -__v')
      .skip(skip)
      .limit(perPage),
    UsersCollection.countDocuments(),
  ]);

  const pagination = calculatePaginationData(totalItems, perPage, page);

  return {
    data: users,
    ...pagination
  };
};

// Отримати одного користувача за id
export const getUserById = async (userId) => {
  const user = await UsersCollection.findById(userId, '-password -savedStories -__v');
  if (!user) throw createHttpError(404, 'User not found');

  return user;
};

// Оновлення профілю користувача (ім'я, email, description, аватар)
export const updateUserProfile = async (userId, updateData) => {
  const user = await UsersCollection.findById(userId);
  if (!user) throw createHttpError(404, 'User not found');

  const allowedFields = ['name', 'description', 'email'];
  const dataToUpdate = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) dataToUpdate[field] = updateData[field];
  }

  Object.assign(user, dataToUpdate);
  await user.save();

  return user;
};

// функція для оновлення аватару
export const updateUserAvatar = async (userId, file) => {
  if (!file) throw createHttpError(400, 'No file provided');

  let avatarUrl;

  if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
    avatarUrl = await saveFileToCloudinary(file);
  } else {
    avatarUrl = await saveFileToUploadDir(file);
  }

  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { avatarUrl },
    { new: true, select: '-password -__v -savedStories' }
  );

  if (!updatedUser) throw createHttpError(404, 'User not found');

  return updatedUser;
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
