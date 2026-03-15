import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import {
  getCurrentUser,
  updateCurrentUser,
  updateUserPassword,
  listUsers,
  updateUserRole,
  getUserById,
  createUser,
  updateUserByAdmin,
  deleteUser
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

export const getUsers = asyncHandler(async (req, res) => {
  const employeesOnly = req.query.employeesOnly === 'true';
  const users = await listUsers({ employeesOnly });
  return successResponse(res, {
    message: 'Users fetched successfully',
    data: { users }
  });
});

export const getEmployees = asyncHandler(async (_req, res) => {
  const users = await listUsers({ employeesOnly: true });
  return successResponse(res, {
    message: 'Team members fetched successfully',
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

export const getUserIdController = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  return successResponse(res, {
    message: 'User fetched successfully',
    data: { user }
  });
});

export const createUserController = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  return successResponse(res, {
    statusCode: 201,
    message: 'User created successfully',
    data: { user }
  });
});

export const updateUserByAdminController = asyncHandler(async (req, res) => {
  const updated = await updateUserByAdmin(req.params.id, req.body);
  return successResponse(res, {
    message: 'User updated successfully',
    data: { user: updated }
  });
});

export const deleteUserController = asyncHandler(async (req, res) => {
  await deleteUser(req.params.id);
  return successResponse(res, {
    message: 'User deleted successfully',
    data: {}
  });
});

