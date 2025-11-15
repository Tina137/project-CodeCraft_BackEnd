import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import * as authService from '../services/auth.js';
import { HTTP_STATUS } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';

const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge,
});

const setupSession = (res, session) => {
  res.cookie('accessToken', session.accessToken, getCookieOptions(FIFTEEN_MINUTES));
  res.cookie('refreshToken', session.refreshToken, getCookieOptions(ONE_DAY));
  res.cookie('sessionId', session._id.toString(), getCookieOptions(ONE_DAY));
};

export const registerUserController = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    const newSession = await authService.createSession(user._id);
    setupSession(res, newSession);

    res.status(HTTP_STATUS.CREATED).json(user);
  } catch (err) {
    next(err);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);

    await SessionsCollection.deleteMany({ userId: user._id });

    const newSession = await authService.createSession(user._id);
    setupSession(res, newSession);

    res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    next(err);
  }
}

export const logoutUserController = async (req, res, next) => {
  try {
    const cookieOptions = { path: '/', secure: process.env.NODE_ENV === 'production', sameSite: 'strict' };
    if (req.cookies && req.cookies.sessionId) {
      await authService.logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('sessionId', cookieOptions);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
};

export const refreshUserSessionController = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId;
    const refreshToken = req.cookies?.refreshToken;

    if (!sessionId || !refreshToken) {
      const err = new Error('Missing sessionId or refreshToken in cookies');
      err.status = 401;
      throw err;
    }

    const session = await authService.refreshUsersSession({
      sessionId,
      refreshToken,
    });

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
    });
  } catch (err) {
    next(err);
  }
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    await authService.requestResetToken(req.body.email);
    res.json({
      message: 'Reset password email was successfully sent!',
      status: 200,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    res.json({
      message: 'Password was successfully reset!',
      status: 200,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
