import express from 'express';
import { authMiddleware, adminMiddleware, requirePrivilege } from '../middlewares/auth.middleware.js';
import { PRIVILEGES } from '../constants/roles.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getProfile,
  updateProfile,
  updatePasswordController,
  getUsers,
  getEmployees,
  updateUserRoleController,
  getUserIdController,
  createUserController,
  updateUserByAdminController,
  deleteUserController
} from '../controllers/user.controller.js';
import {
  updateProfileSchema,
  updatePasswordSchema,
  updateUserRoleSchema,
  createUserSchema,
  updateUserByAdminSchema
} from '../validators/user.validator.js';

const router = express.Router();

router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, validate(updateProfileSchema), updateProfile);
router.put('/me/password', authMiddleware, validate(updatePasswordSchema), updatePasswordController);

router.get('/', authMiddleware, adminMiddleware, getUsers);
router.get('/employees', authMiddleware, requirePrivilege(PRIVILEGES.EMPLOYEES_LIST), getEmployees);
router.get('/:id', authMiddleware, adminMiddleware, getUserIdController);
router.post('/', authMiddleware, adminMiddleware, validate(createUserSchema), createUserController);
router.put('/:id/role', authMiddleware, adminMiddleware, validate(updateUserRoleSchema), updateUserRoleController);
router.put('/:id', authMiddleware, adminMiddleware, validate(updateUserByAdminSchema), updateUserByAdminController);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUserController);

export default router;

