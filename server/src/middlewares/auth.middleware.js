import { verifyToken } from '../utils/token.util.js';
import { errorResponse } from '../utils/response.util.js';
import { ROLES } from '../constants/roles.js';

/** Attaches user to req if valid token present; does not require auth. */
export function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return next();
  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
  } catch (_) {
    // ignore invalid token for optional auth
  }
  return next();
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return errorResponse(res, {
      statusCode: 401,
      message: 'Unauthorized',
      errors: [{ message: 'Missing or invalid token' }]
    });
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
    return next();
  } catch (err) {
    return errorResponse(res, {
      statusCode: 401,
      message: 'Unauthorized',
      errors: [{ message: 'Invalid or expired token' }]
    });
  }
}

export function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return errorResponse(res, {
      statusCode: 403,
      message: 'Forbidden',
      errors: [{ message: 'Admin access required' }]
    });
  }
  return next();
}

