import Joi from 'joi';

export const addToCartSchema = Joi.object({
  body: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).default(1)
  })
});

export const updateCartItemSchema = Joi.object({
  body: Joi.object({
    quantity: Joi.number().integer().min(0).required()
  })
});

export const applyCouponSchema = Joi.object({
  body: Joi.object({
    code: Joi.string().trim().required()
  })
});

export const validateCouponSchema = Joi.object({
  body: Joi.object({
    code: Joi.string().trim().required(),
    amount: Joi.number().min(0).required()
  })
});

export const prepareCheckoutSchema = Joi.object({
  body: Joi.object({
    addressId: Joi.string().required(),
    couponCode: Joi.string().trim().optional()
  })
});

