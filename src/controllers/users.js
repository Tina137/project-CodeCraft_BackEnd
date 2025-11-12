import createHttpError from 'http-errors';
// import { updateUserProfile } from '../services/users.js';
import { HTTP_STATUS } from '../constants/index.js';
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  addStoryToSaved,
  removeStoryFromSaved,
} from '../services/users.js';
// import { getEnvVar } from '../utils/getEnvVar.js';
// import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
// import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getAllUsersController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { users, total } = await getAllUsers(Number(page), Number(limit));

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: 'Users fetched successfully',
      page: Number(page),
      limit: Number(limit),
      total,
      data: users,
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
    const file = req.file;
    const body = req.body || {};

    const updatedUser = await updateUserProfile(userId, body, file);

    // let avatarUrl;

    // if (file) {
    //   if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
    //     avatarUrl = await saveFileToCloudinary(file);
    //   } else {
    //     avatarUrl = await saveFileToUploadDir(file);
    //   }
    // }

    // const allowedFields = ['name', 'description', 'email'];
    // const updateData = {};

    // for (const field of allowedFields) {
    //   if (body[field] !== undefined) {
    //     updateData[field] = body[field];
    //   }
    // }

    // if (avatarUrl) updateData.avatarUrl = avatarUrl;

    // const updatedUser = await updateUserProfile(userId, updateData);

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
