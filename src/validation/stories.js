import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createStorySchema = Joi.object({
  title: Joi.string().max(80).required().messages({
    'string.max': 'The Title field must contain no more than 80 characters.',
    'any.required': 'The Title field is required.'
  }),
  article: Joi.string().max(2500).required().messages({
    'string.max': 'The Article field must contain no more than 2500 characters.',
    'any.required': 'The Article field is required.'
  }),
  category: Joi.string().required().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Category id should be a valid mongo id');
    }
    return true;
  }).messages({
    'any.required': 'Category is required.'
  }),
});

export const updateStorySchema = Joi.object({
  title: Joi.string().max(80).messages({
    'string.max': 'The Title field must contain no more than 80 characters.'
  }),
  article: Joi.string().max(2500).messages({
    'string.max': 'The Article field must contain no more than 2500 characters.'
  }),
  category: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Category id should be a valid Mongo id');
    }
    return true;
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided to update the story.',
});
