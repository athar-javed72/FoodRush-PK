import express from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getProfile,
  updateProfile,
  updatePasswordController,
  getUsers,
  updateUserRoleController
} from '../controllers/user.controller.js';
import {
  updateProfileSchema,
  updatePasswordSchema,
  updateUserRoleSchema
} from '../validators/user.validator.js';

const router = express.Router();

router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, validate(updateProfileSchema), updateProfile);
router.put('/me/password', authMiddleware, validate(updatePasswordSchema), updatePasswordController);

router.get('/', authMiddleware, adminMiddleware, getUsers);
router.put('/:id/role', authMiddleware, adminMiddleware, validate(updateUserRoleSchema), updateUserRoleController);

export default router;

