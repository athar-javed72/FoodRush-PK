import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { ROLES, type Role, hasMinimumRole } from './roles';

const JWT_SECRET = process.env.JWT_SECRET || 'foodie-dev-secret-change-in-production';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function authMiddleware(requiredRole?: Role) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid token' });
      return;
    }

    try {
      const payload = verifyToken(token) as JwtPayload;
      (req as Request & { user: JwtPayload }).user = payload;

      if (requiredRole && !hasMinimumRole(payload.role, requiredRole)) {
        res.status(403).json({ error: 'Forbidden', message: 'Insufficient role' });
        return;
      }

      next();
    } catch {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }
  };
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyToken(token) as JwtPayload;
    (req as Request & { user?: JwtPayload }).user = payload;
  } catch {
    // ignore invalid token for optional auth
  }
  next();
}
