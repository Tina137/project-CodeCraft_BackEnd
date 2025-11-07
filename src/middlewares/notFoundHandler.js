import pkg from 'http-errors';
const { createError } = pkg;

export function notFoundHandler(req, res, next) {
  next(createError(404, 'Route not found'));
}
