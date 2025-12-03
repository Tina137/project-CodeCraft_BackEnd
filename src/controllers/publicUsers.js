import { UsersCollection } from '../db/models/user.js';
import { StoryCollection } from '../db/models/stories.js';
import createHttpError from 'http-errors';

export const getPublicUserByIdController = async (req, res) => {
  const { userId } = req.params;

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 6);

  const skip = (page - 1) * limit;

  const user = await UsersCollection.findById(userId).select('-password');
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const totalItems = await StoryCollection.countDocuments({
    ownerId: userId,
  });

  const stories = await StoryCollection.find({ ownerId: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const hasNextPage = skip + stories.length < totalItems;

  res.json({
    status: 200,
    message: 'User and stories fetched successfully',

    user,
    stories,

    page,
    perPage: limit,
    totalItems,
    hasNextPage,
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
