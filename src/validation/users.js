import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(32).trim().messages({
    'string.min': 'The Name field must contain at least 3 characters.',
    'string.max': 'The Name field must contain no more than 32 characters.',
    'string.empty': 'The Name field cannot be empty.',
  }),
  email: Joi.string().email().max(64).messages({
    'string.email': 'The Email field must be a valid email address.',
    'string.max': 'The Email field must contain no more than 64 characters.',
  }),
  description: Joi.string().max(150).messages({
    'string.max': 'The Description field must contain no more than 150 characters.',
  }),
  articlesAmount: Joi.number().integer().min(0).messages({
    'number.base': 'The Articles Amount field must be a number.',
    'number.integer': 'The Articles Amount field must be an integer.',
    'number.min': 'The Articles Amount field must be a non-negative integer.',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided to update the user.',
});
