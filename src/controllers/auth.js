import { ONE_DAY } from '../constants/index.js';
import * as authService from '../services/auth.js';
import { HTTP_STATUS } from '../constants/index.js';
import { loginUser } from '../services/auth.js';

export const register = async (req, res) => {
  try {
    const data = await authService.register(req.body);
    res.status(HTTP_STATUS.CREATED).json(data);
  } catch (error) {

   
    if (error.message === 'Email already in use') {
      return res.status(HTTP_STATUS.CONFLICT).json({ message: error.message });
    }
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: error.message });
  }
};

/////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////