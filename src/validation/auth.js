import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.min': 'The Name field must contain at least 3 characters.',
    'any.required': 'The Name field is required.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'The Email field must be a valid email address.',
    'any.required': 'The Email field is required.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'The Password field must contain at least 6 characters.',
    'any.required': 'The Password field is required.'
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'The Email field must be a valid email address.',
    'any.required': 'The Email field is required.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'The Password field must contain at least 6 characters.',
    'any.required': 'The Password field is required.'
  }),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'The Email field must be a valid email address.',
    'any.required': 'The Email field is required.'
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    'string.min': 'The Password field must contain at least 6 characters.',
    'any.required': 'The Password field is required.'
  }),
  token: Joi.string().required().messages({
    'any.required': 'The Token field is required.'
  }),
});
