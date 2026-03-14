import Joi from 'joi';
import { ROLES } from '../constants/roles.js';

const pkPhonePattern = /^03\d{9}$/;

export const updateProfileSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100),
    phone: Joi.string()
      .pattern(pkPhonePattern)
      .message('Phone must be a valid Pakistan number (03xxxxxxxxx)')
      .allow('', null)
  })
});

export const updatePasswordSchema = Joi.object({
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(128).required()
  })
});

export const updateUserRoleSchema = Joi.object({
  body: Joi.object({
    role: Joi.string()
      .valid(...Object.values(ROLES))
      .required()
  })
});
