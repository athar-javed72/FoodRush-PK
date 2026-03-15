import Joi from 'joi';

export const createComplaintSchema = Joi.object({
  body: Joi.object({
    subject: Joi.string().min(1).max(200).required(),
    description: Joi.string().min(1).max(2000).required()
  })
});

export const updateComplaintStatusSchema = Joi.object({
  body: Joi.object({
    status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed').required(),
    adminNotes: Joi.string().max(1000).allow('', null)
  })
});
