import Joi from 'joi';

export const createCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string().min(2).max(120),
    description: Joi.string().allow('', null),
    image: Joi.string().uri().allow(null, ''),
    isActive: Joi.boolean()
  })
});

export const updateCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100),
    slug: Joi.string().min(2).max(120),
    description: Joi.string().allow('', null),
    image: Joi.string().uri().allow(null, ''),
    isActive: Joi.boolean()
  })
});

