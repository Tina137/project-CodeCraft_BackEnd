import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      req.isAuthenticated = false;
      return next();
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      req.isAuthenticated = false;
      return next();
    }

    const session = await SessionsCollection.findOne({ accessToken: token })
      .select('userId accessTokenValidUntil')
      .lean();
    if (!session) {
      req.isAuthenticated = false;
      return next();
    }

    const isExpired = new Date() > new Date(session.accessTokenValidUntil);
    if (isExpired) {
      req.isAuthenticated = false;
      return next();
    }

    const user = await UsersCollection.findById(session.userId);
    if (!user) {
      req.isAuthenticated = false;
      return next();
    }

    req.user = user;
    req.isAuthenticated = true;
    next();
  } catch {
    req.isAuthenticated = false;
    next();
  }
};
