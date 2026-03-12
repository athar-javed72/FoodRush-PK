import Joi from 'joi';

export const createReviewSchema = Joi.object({
  body: Joi.object({
    productId: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().allow('', null)
  })
});

