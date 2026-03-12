import { errorResponse } from '../utils/response.util.js';

export function validate(schema) {
  return (req, res, next) => {
    const data = {
      body: req.body,
      query: req.query,
      params: req.params
    };

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Validation error',
        errors: error.details.map((d) => ({
          message: d.message,
          path: d.path
        }))
      });
    }

    req.body = value.body || req.body;
    req.query = value.query || req.query;
    req.params = value.params || req.params;
    return next();
  };
}

