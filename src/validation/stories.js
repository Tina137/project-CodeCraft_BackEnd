import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createStorySchema = Joi.object({
  title: Joi.string().max(80).required(),
  article: Joi.string().max(2500).required(),
  category: Joi.string()
    .required()
    .custom((value, helper) => {
      if (value && !isValidObjectId(value)) {
        return helper.message('Category id should be a valid mongo id');
      }
      return true;
    }),
});

export const updateStorySchema = Joi.object({
  title: Joi.string().max(80),
  article: Joi.string().max(2500),
  category: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Category id should be a valid Mongo id');
    }
    return true;
  }),
});
