import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) return next(createHttpError(401, 'Please provide Authorization header'));

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return next(createHttpError(401, 'Auth header should be of type Bearer'));
    }

    const session = await SessionsCollection.findOne({ accessToken: token }).select('userId accessTokenValidUntil').lean();
    if (!session) return next(createHttpError(401, 'Session not found'));

    const isExpired = new Date() > new Date(session.accessTokenValidUntil);
    if (isExpired) return next(createHttpError(401, 'Access token expired'));

    const user = await UsersCollection.findById(session.userId);
    if (!user) return next(createHttpError(401, 'User not found'));

    req.user = user; 
    return next();
  } catch (err) {
    return next(err);
  }
};
