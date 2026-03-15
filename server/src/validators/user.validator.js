import Joi from 'joi';
import { ROLES } from '../constants/roles.js';

const pkPhonePattern = /^03\d{9}$/;

export const updateProfileSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100),
    phone: Joi.string()
      .pattern(pkPhonePattern)
      .message('Phone must be a valid Pakistan number (03xxxxxxxxx)')
      .allow('', null),
    avatar: Joi.string().uri().allow(null, '')
  })
});

export const createUserSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    role: Joi.string().valid(...Object.values(ROLES)).required()
  })
});

export const updateUserByAdminSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    role: Joi.string().valid(...Object.values(ROLES)),
    isActive: Joi.boolean(),
    avatar: Joi.string().uri().allow(null, ''),
    phone: Joi.string().pattern(pkPhonePattern).allow('', null),
    department: Joi.string().max(100).allow('', null),
    newPassword: Joi.string().min(6).max(128).allow('')
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
