import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {

    if (req.file && Object.keys(req.body || {}).length === 0) {
      return next();
    }

    await schema.validateAsync(req.body, { abortEarly: false, });

    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad Request', {
      errors: err.details?.map((e) => ({
        message: e.message,
        path: e.path,
        type: e.type,
      })),
    });
    next(error);
  }
};
