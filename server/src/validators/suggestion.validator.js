import Joi from 'joi';

export const createSuggestionSchema = Joi.object({
  body: Joi.object({
    subject: Joi.string().min(1).max(200).required(),
    description: Joi.string().min(1).max(2000).required()
  })
});

export const updateSuggestionStatusSchema = Joi.object({
  body: Joi.object({
    status: Joi.string().valid('new', 'under_review', 'accepted', 'rejected').required(),
    adminNotes: Joi.string().max(1000).allow('', null)
  })
});
