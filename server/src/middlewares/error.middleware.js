import { errorResponse } from '../utils/response.util.js';

// 404 handler
export function notFoundHandler(_req, res, _next) {
  return errorResponse(res, {
    statusCode: 404,
    message: 'Route not found'
  });
}

// Central error handler
export function errorHandler(err, _req, res, _next) {
  // Basic fallback
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return errorResponse(res, {
    statusCode,
    message,
    errors: err.errors || []
  });
}

