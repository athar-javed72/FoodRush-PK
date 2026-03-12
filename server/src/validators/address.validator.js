import Joi from 'joi';

export const createAddressSchema = Joi.object({
  body: Joi.object({
    fullName: Joi.string().min(2).max(100).required(),
    phone: Joi.string().min(5).max(20).required(),
    city: Joi.string().required(),
    area: Joi.string().required(),
    streetAddress: Joi.string().required(),
    landmark: Joi.string().allow('', null),
    postalCode: Joi.string().required(),
    label: Joi.string().allow('', null),
    isDefault: Joi.boolean()
  })
});

export const updateAddressSchema = Joi.object({
  body: Joi.object({
    fullName: Joi.string().min(2).max(100),
    phone: Joi.string().min(5).max(20),
    city: Joi.string(),
    area: Joi.string(),
    streetAddress: Joi.string(),
    landmark: Joi.string().allow('', null),
    postalCode: Joi.string(),
    label: Joi.string().allow('', null),
    isDefault: Joi.boolean()
  })
});

