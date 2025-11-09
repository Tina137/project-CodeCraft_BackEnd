import createHttpError from 'http-errors';
import {updateUserInfo} from '../services/users.js';

export const getCurrentUserController = async (req, res) => {
    
        const user = req.user;

        if (!user) {
            throw createHttpError(401, 'Not authorized')
        }

        res.json({
            status: 200,
            message: 'Current user fetched successfully',
            data: user,
        })
}

export const updateUserInfoController = async (req, res, next) => {
    const {userId} = req.params;
    const user = await updateUserInfo(userId, req.body);


    if (!user) {
        next(createHttpError(404, 'User not found'))
        return;
    }

    res.json({
    status: 200,
    message: 'User was successfully updated!',
    data: user,
  });
}

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedUser = await updateUserAvatar(req.user._id, req.file.filename);

    res.json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
