import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const id = req.params.storyId || req.params.userId;
  if (!isValidObjectId(id)) {
    throw createHttpError(400, 'Bad Request');
  }
  next();
};
