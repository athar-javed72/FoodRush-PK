import Joi from 'joi';

export const createOrderSchema = Joi.object({
  body: Joi.object({
    addressId: Joi.string().required(),
    paymentMethod: Joi.string().valid('cod', 'mock_online').default('cod'),
    notes: Joi.string().max(500).allow('', null)
  })
});

export const updateOrderStatusSchema = Joi.object({
  body: Joi.object({
    status: Joi.string()
      .valid('Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled')
      .required()
  })
});

