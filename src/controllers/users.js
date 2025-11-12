import createHttpError from 'http-errors';
import {
  updateUserInfo,
  addStoryToSaved,
  removeStoryFromSaved,
  updateUserAvatar,
} from '../services/users.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getCurrentUserController = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw createHttpError(401, 'Not authorized');
  }

  res.status(200).json({
    message: 'Current user fetched successfully',
    data: user,
  });
};

export const updateUserInfoController = async (req, res, next) => {
  const userId = req.user._id;
  const user = await updateUserInfo(userId, req.body);

  if (!user) {
    next(createHttpError(404, 'User not found'));
    return;
  }

  res.status(200).json({
    message: 'User was successfully updated!',
    data: user,
  });
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const baseUrl = await saveFileToCloudinary(req.file);

    const updatedUser = await updateUserAvatar(
      req.user._id,
      req.file.filename,
      baseUrl,
    );

    res.json({
      message: 'Avatar updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addSavedStoryController = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const savedStories = await addStoryToSaved(req.user._id, storyId);

    res.status(200).json({
      message: 'Story added to saved',
      savedStories,
    });
  } catch (error) {
    next(error);
  }
};

export const removeSavedStoryController = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const savedStories = await removeStoryFromSaved(req.user._id, storyId);

    res.status(200).json({
      message: 'Story removed from saved',
      savedStories,
    });
  } catch (error) {
    next(error);
  }
};
