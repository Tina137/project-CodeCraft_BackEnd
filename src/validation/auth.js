
import Joi from 'joi';
import { HTTP_STATUS } from '../constants/index.js';


export const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
  };
};

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});