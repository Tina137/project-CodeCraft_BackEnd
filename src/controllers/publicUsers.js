import { UsersCollection } from '../db/models/user.js';
import { StoryCollection } from '../db/models/stories.js';
import createHttpError from 'http-errors';

export const getUserByIdController = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 6 } = req.query;
  const skip = (page - 1) * limit;

  const user = await UsersCollection.findById(userId).select('-password');
  if (!user) throw createHttpError(404, 'User not found');

  const totalStories = await StoryCollection.countDocuments({ ownerId: userId });

  const userStories = await StoryCollection.find({ ownerId: userId })
    .skip(skip)
    .limit(Number(limit));

  const userData = {
    ...user.toObject(),
    canFavorite: !!req.isAuthenticated,
  };

  // Этот блок добавит булевые значения isFavorited к историям искомого автора, если история у Юзера в избранном будет true - для UI компонентов
  const storiesData = userStories.map((story) => {
    let isFavorited = false;

    if (req.isAuthenticated && req.user.savedStories) {
      isFavorited = req.user.favoriteStories.includes(story._id.toString());
    }

    return {
      ...story.toObject(),
      canFavorite: !!req.isAuthenticated,
      isFavorited,
    };
  });

  res.json({
    user: userData,
    stories: storiesData,
  });
};

export const getUsersListController = async (req, res) => {
  const { page = 1, limit = 8 } = req.query;
  const skip = (page - 1) * Number(limit);

  const users = await UsersCollection.find()
    .select('_id name avatarUrl description articlesAmount updatedAt')
    .skip(skip)
    .limit(Number(limit));

  const totalUsers = await UsersCollection.countDocuments();

  res.json({
    status: 200,
    message: 'Users fetched successfully',
    page: Number(page),
    limit: Number(limit),
    total: totalUsers,
    hasNextPage: skip + users.length < totalUsers,
    data: users,
  });
};
