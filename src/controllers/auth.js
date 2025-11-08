import { ONE_DAY } from '../constants/index.js';
import * as authService from '../services/auth.js';
import { HTTP_STATUS } from '../constants/index.js';

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