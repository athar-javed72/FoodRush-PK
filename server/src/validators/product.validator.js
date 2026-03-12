import Joi from 'joi';

export const createProductSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(150).required(),
    slug: Joi.string().min(2).max(180),
    description: Joi.string().min(5).required(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().uri().allow(null, ''),
    gallery: Joi.array().items(Joi.string().uri()).default([]),
    isAvailable: Joi.boolean(),
    tags: Joi.array().items(Joi.string().trim()).default([])
  })
});

export const updateProductSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(150),
    slug: Joi.string().min(2).max(180),
    description: Joi.string().min(5),
    category: Joi.string(),
    price: Joi.number().min(0),
    image: Joi.string().uri().allow(null, ''),
    gallery: Joi.array().items(Joi.string().uri()),
    isAvailable: Joi.boolean(),
    tags: Joi.array().items(Joi.string().trim())
  })
});

