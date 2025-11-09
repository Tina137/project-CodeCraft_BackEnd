import createHttpError from 'http-errors';
import {} from '../services/users.js';
import { UsersCollection } from '../db/models/user.js'; // додаємо імпорт моделі

// Контролер для оновлення аватару
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await UsersCollection.findByIdAndUpdate(
      req.user._id,       // користувач із токена
      { avatarUrl: avatarPath },
      { new: true }
    );

    res.json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
