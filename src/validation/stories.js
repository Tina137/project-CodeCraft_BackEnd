import Joi from 'joi';

export const createStorySchema = Joi.object({
  title: Joi.string().min(3).required(),
  article: Joi.string(),
  favoriteCount: Joi.number(),
  category: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Category id should be a valid mongo id');
    }
    return true;
  }),
  ownerId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('User id should be a valid mongo id');
    }
    return true;
  }),
});

export const updateStorySchema = Joi.object({
  title: Joi.string().min(3),
  article: Joi.string(),
  favoriteCount: Joi.number(),
  category: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Category id should be a valid mongo id');
    }
    return true;
  }),
  ownerId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('User id should be a valid mongo id');
    }
    return true;
  }),
});
