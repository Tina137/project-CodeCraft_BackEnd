import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(32).messages({
    'string.min': "Поле 'ім'я' має містити не менше 3 символів",
    'string.max': "Поле 'ім'я' має містити не більше 32 символів",
  }),

  email: Joi.string().email().max(64).messages({
    'string.email': 'Email має бути валідним',
    'string.max': 'Email має містити не більше 64 символів',
  }),

  avatarUrl: Joi.string().uri().messages({
    'string.uri': 'Поле avatarUrl має містити коректне посилання (URL)',
  }),

  description: Joi.string().max(500).messages({
    'string.max': 'Опис має містити не більше 500 символів',
  }),

  articlesAmount: Joi.number().integer().min(0).messages({
    'number.base': 'Кількість статей має бути числом',
    'number.min': 'Кількість статей не може бути від’ємною',
  }),
}).min(1);