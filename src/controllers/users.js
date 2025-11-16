import createHttpError from 'http-errors';
import { HTTP_STATUS } from '../constants/index.js';
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  addStoryToSaved,
  removeStoryFromSaved,
} from '../services/users.js';

export const getAllUsersController = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const result = await getAllUsers(Number(page), Number(perPage));

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: 'Users fetched successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: 'User fetched successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserController = async (req, res) => {
  try {
    const user = req.user;

    if (!user) throw createHttpError(401, 'Not authorized');

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: 'Current user fetched successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfileController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const body = req.body || {};

    const updatedUser = await updateUserProfile(userId, body);

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: 'User profile successfully updated!',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatarController = async (req, res, next) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    const updatedUser = await updateUserAvatar(userId, file);

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: 'Avatar updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const addSavedStoryController = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const savedStories = await addStoryToSaved(req.user._id, storyId);

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
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

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: 'Story removed from saved',
      savedStories,
    });
  } catch (error) {
    next(error);
  }
};
