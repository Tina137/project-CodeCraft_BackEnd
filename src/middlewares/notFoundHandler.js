import { HTTP_STATUS } from '../constants/index.js';

export const notFoundHandler = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Route not found' });
};
