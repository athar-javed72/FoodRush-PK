import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import { getCurrentUser, updateCurrentUser } from '../services/user.service.js';

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

