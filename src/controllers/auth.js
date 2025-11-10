import { ONE_DAY } from '../constants/index.js';
import * as authService from '../services/auth.js';
import { HTTP_STATUS } from '../constants/index.js';
import { loginUser, resetPassword } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  try {
    const data = await authService.registerUser(req.body);
    res.status(HTTP_STATUS.CREATED).json(data);
  } catch (error) {


    if (error.message === 'Email already in use') {
      return res.status(HTTP_STATUS.CONFLICT).json({ message: error.message });
    }
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: error.message });
  }
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body.email, req.body.password);

  res.cookie('refreshtoken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY * 7)
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY * 7)
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: { accessToken: session.accessToken }
  });
}

export const logoutUserController = async (req, res, next) => {
  try {

    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];

    await authService.logoutUser(token);

    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};


export const requestResetEmailController = async (req, res) => {
  await authService.requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: HTTP_STATUS.OK,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
