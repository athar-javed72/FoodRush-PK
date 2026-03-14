import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import {
  getCurrentUser,
  updateCurrentUser,
  updateUserPassword,
  listUsers,
  updateUserRole
} from '../services/user.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  return successResponse(res, {
    message: 'Profile fetched successfully',
    data: { user }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updated = await updateCurrentUser(req.user.id, req.body);
  return successResponse(res, {
    message: 'Profile updated successfully',
    data: { user: updated }
  });
});

export const updatePasswordController = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await updateUserPassword(req.user.id, {
    currentPassword,
    newPassword
  });
  return successResponse(res, {
    message: 'Password updated successfully',
    data: { user }
  });
});

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await listUsers();
  return successResponse(res, {
    message: 'Users fetched successfully',
    data: { users }
  });
});

export const updateUserRoleController = asyncHandler(async (req, res) => {
  const updated = await updateUserRole(req.params.id, req.body.role);
  return successResponse(res, {
    message: 'User role updated successfully',
    data: { user: updated }
  });
});

