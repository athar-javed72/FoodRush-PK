import Joi from 'joi';

export const createCouponSchema = Joi.object({
  body: Joi.object({
    code: Joi.string().trim().min(2).max(50).required(),
    discountType: Joi.string().valid('percentage', 'fixed').required(),
    discountValue: Joi.number().min(0).required(),
    minOrderAmount: Joi.number().min(0).default(0),
    expiryDate: Joi.date().greater('now').required(),
    isActive: Joi.boolean().default(true)
  })
});

export const updateCouponSchema = Joi.object({
  body: Joi.object({
    code: Joi.string().trim().min(2).max(50),
    discountType: Joi.string().valid('percentage', 'fixed'),
    discountValue: Joi.number().min(0),
    minOrderAmount: Joi.number().min(0),
    expiryDate: Joi.date(),
    isActive: Joi.boolean()
  })
});
