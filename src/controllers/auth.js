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
export const logout = async (req, res, next) => {
  try {
  
    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];

    await authService.logout(token);
    
    res.sendStatus(HTTP_STATUS.NO_CONTENT); 
  } catch (error) {
    next(error);
  }
};