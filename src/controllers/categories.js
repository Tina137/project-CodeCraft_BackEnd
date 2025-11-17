import { getCategories } from '../services/categories.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getCategoriesController = async (req, res, next) => {
  try {
    const categories = await getCategories();

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: 'Successfully fetched categories!',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
