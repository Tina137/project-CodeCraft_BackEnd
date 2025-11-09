import { UsersCollection } from "../db/models/user.js";


export const updateUserInfo = async (userId, payload) => {
    const userUpdate = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    payload,
    { new: true },
  );

  return userUpdate;
}

// функція для оновлення аватару
export const updateUserAvatar = async (userId, filename) => {
  const avatarPath = `/uploads/avatars/${filename}`;

  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { avatarUrl: avatarPath },
    { new: true }
  );

  return updatedUser;
};
