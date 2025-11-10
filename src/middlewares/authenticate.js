import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const sessionId = req.cookies?.sessionId;

    if (!accessToken || !sessionId) return next(createHttpError(401, 'Please provide access token in cookies'));

    const session = await SessionsCollection.findOne({ accessToken, _id: sessionId });

    if (!session) return next(createHttpError(401, 'Session not found'));

    const isExpired = new Date() > new Date(session.accessTokenValidUntil);
    if (isExpired) return next(createHttpError(401, 'Access token expired'));

    const user = await UsersCollection.findById(session.userId);
    if (!user) return next(createHttpError(401, 'User not found'));

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
